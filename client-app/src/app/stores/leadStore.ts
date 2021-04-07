import {
  observable,
  action,
  computed,
  runInAction,
  reaction,
  makeObservable,
  autorun,
} from 'mobx';
import { toast } from 'react-toastify';
import { IContact, ContactFormValues } from '../models/contact';
import agent from '../api/agent';
import { RootStore } from './rootStore';
import { ILead, Lead } from '../models/lead';

export default class LeadStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    makeObservable(this, {
      selectedLead: observable,
      loadingInitial: observable,
      showLeadForm: observable,
      submitting: observable,
      leadRegistry: observable,
      selectedValue: observable,
      selected: observable,
      confirmation: observable,
      progress: observable,
      modalDecision: observable,
      allLeads: observable,
      status: observable,
      sortBy: observable,
      keepRecords: observable,
      saveContact: observable,
      targetLead: observable,
      contactId: observable,
      listAxiosParams: computed,
      abandonAxiosParams: computed,
      leadsList: computed,
      leadsByStatus: computed,
      save: action,
      keep: action,
      setTargetLead: action,
      addLeadForm: action,
      editLeadForm: action,
      setShowLeadForm: action,
      fillForm: action,
      setLeadList: action,
      loadLeads: action,
      addLead: action,
      changeLeadStatus: action,
      editLead: action,
      abandonLead: action,
    });

    this.rootStore = rootStore;
    // reaction(
    //   () => this.modalDecision,
    //   () => {
    //     if (this.modalDecision.refuse) {
    //       this.modalDecision.refuse = false;
    //       this.abandonLead();
    //       // this.abandonLead(this.modalDecision.lead.id);
    //
    //     } else if (this.modalDecision.accept) {
    //       this.modalDecision.refuse = false;
    //       this.modalDecision.lead.type = 'Client';
    //       // this.editLead(this.modalDecision.lead);
    //
    //     } else console.log('Failed to make changes');
    //   }
    // );
    // autorun(() => this.loadLeads());
  }

  /////////////////////////////////////
  // collections
  leadRegistry = new Map();
  // forms and modals
  showLeadForm = false;
  modalDecision = {
    refuse: false,
    accept: false,
    lead: new ContactFormValues(),
  };
  keepRecords: boolean = true;
  saveContact: boolean = true;
  confirmation = false;
  //controls
  loadingInitial = false;
  submitting = false;
  selectedLead: ILead | undefined;
  selectedValue = '';
  targetLead: ILead = new Lead();
  contactId: string = '';
  selected: string | null = '';
  progress: number = 20;
  // list parameters
  allLeads = true;
  status: string = 'all';
  sortBy: string = 'date';
  /////////////////////////////////////

  ////
  // *Computeds*
  //
  get listAxiosParams() {
    const params = new URLSearchParams();
    params.append('allLeads', `${this.allLeads}`);
    params.append('status', `${this.status}`);
    params.append('sortBy', `${this.sortBy}`);
    return params;
  }

  get abandonAxiosParams() {
    const params = new URLSearchParams();
    params.append('id', `${this.contactId}`);
    params.append('keepRecords', `${this.keepRecords}`);
    params.append('saveContact', `${this.saveContact}`);
    return params;
  }

  get leadsList() {
    return Array.from(this.leadRegistry.values());
  }

  get leadsByStatus() {
    var leads: Array<IContact>;
    this.leadRegistry.forEach((lead) => {
      if (lead.status == status) leads.push(lead);
    });
    return;
  }

  ////
  // *Functions*
  //
  handleLead = (arg: string, lead: ILead) => {
    switch (arg) {
      case 'upgrade':
        this.changeLeadStatus(lead, true);
        break;
      case 'downgrade':
        this.changeLeadStatus(lead, false);
        break;
      case 'abandon':
        this.rootStore.modalStore.openModal(
          'Would you like to save the data of that sale process?',
          'abandon'
        );
        break;
      case 'edit':
        this.editLeadForm(lead);
        break;
    }
  };

  ////
  // *Actions*
  //
  // Loading and submitting actions. According to MobX documentation it's recommended to
  // modify observables only by actions
  loadingData = (value: boolean) => {
    runInAction(() => {
      this.loadingInitial = value;
    });
  };

  submittingData = (value: boolean) => {
    runInAction(() => {
      this.submitting = value;
    });
  };

  save = () => {
    runInAction(() => {
      this.saveContact ? (this.saveContact = false) : (this.saveContact = true);
    });
  };

  keep = () => {
    runInAction(() => {
      this.keepRecords ? (this.keepRecords = false) : (this.keepRecords = true);
    });
  };

  setTargetLead = (lead: ILead) => {
    runInAction(() => {
      this.targetLead = lead;
      this.contactId = lead.contact.id;
    });
  };

  setLeadList = (
    arg: string,
    sortBy: string,
    ev?: EventTarget & HTMLButtonElement
  ) => {
    if (ev != undefined) {
      for (var child of ev?.parentElement!.children)
        child.classList.remove('active');
      ev.classList.add('active');
    }
    runInAction(() => {
      if (arg == 'all') {
        this.allLeads = true;
      } else {
        this.allLeads = false;
      }
      this.status = arg;
      this.sortBy = sortBy;
      this.listAxiosParams;
    });
    this.loadLeads();
  };
  //----------------------------------------

  // *Forms*
  addLeadForm = () => {
    this.loadingData(true);
    runInAction(() => {
      this.selectedLead = undefined;
      this.selectedValue = '';
      this.showLeadForm = true;
    });
    this.loadingData(false);
  };

  editLeadForm = (lead: ILead) => {
    this.loadingData(true);
    runInAction(() => {
      this.selectedLead = this.leadRegistry.get(lead.contact.id);
    });
    this.setShowLeadForm(true);
    this.loadingData(false);
  };

  setShowLeadForm = (show: boolean) => {
    this.showLeadForm = show;
  };

  fillForm = () => {
    if (this.selectedLead?.contact) {
      return this.selectedLead.contact;
    }
    return new ContactFormValues();
  };
  //----------------------------------------------

  // *CRUD task actions*
  loadLeads = async (leadId?:string) => {
    this.loadingData(true);
    try {
      const leads = await agent.Leads.list(this.listAxiosParams);
      runInAction(() => {
        this.leadRegistry.clear();
        leads.forEach((lead) => {
          this.leadRegistry.set(lead.contact.id, lead);
        });
      });
      this.loadingData(false);
    } catch (error) {
      this.loadingData(false);
      console.log(error);
    }
  };

  addLead = async (values: ILead) => {
    this.submittingData(true);
    let lead = values;
    try {
      await agent.Leads.add(lead);
      runInAction(() => {
        this.leadRegistry.set(lead.contact.id, lead);
        this.showLeadForm = false;
      });
      toast.success('Lead added');
      //reload list with status of added lead
      this.setLeadList(lead.contact.status, this.sortBy);
      this.submittingData(false);
    } catch (error) {
      this.submittingData(false);
      console.log(error);
    }
  };

  changeLeadStatus = async (lead: ILead, upgrade: boolean) => {
    this.submittingData(true);
    try {
      await agent.Leads.changeStatus(lead.contact.id, upgrade);
      await this.loadLeads();
      this.submittingData(false);
    } catch (error) {
      this.submittingData(false);
      console.log(error);
      toast.error(error.data.errors);
    }
  };

  editLead = async (lead: ILead) => {
    this.submittingData(true);
    if (this.selectedLead !== lead) {
      try {
        await agent.Contacts.update(lead.contact);
        runInAction(() => {
          this.leadRegistry.set(lead.contact.id, lead);
          this.showLeadForm = false;
        });
        this.submittingData(false);
      } catch (error) {
        this.submittingData(false);
        toast.error('Problem occured');
        console.log(error);
      }
    } else {
      this.showLeadForm = false;
      this.submitting = false;
    }
  };

  abandonLead = async () => {
    this.submittingData(true);
    try {
      await agent.Leads.abandonLead(this.abandonAxiosParams);
      this.loadLeads();
      runInAction(() => {
        this.leadRegistry.delete(this.contactId);
        this.selectedLead = undefined;
      });
      this.submittingData(false);
      toast.success('Lead has been removed');
    } catch (error) {
      this.submittingData(false);
      console.log(error);
      toast.error(error.data.errors);
    }
  };
  //----------------------------------------
}
