import { observable, action, computed, runInAction, reaction } from 'mobx';
import { toast } from 'react-toastify';
import { IContact, ContactFormValues } from '../models/contact';
import agent from '../api/agent';
import { RootStore } from './rootStore';
import { ILead, Lead } from '../models/lead';
import React from 'react';

export default class LeadStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    // reaction(
    //   () => this.modalDecision,
    //   () => {
    //     if (this.modalDecision.refuse) {
    //       this.modalDecision.refuse = false;
    //       this.abandonLead();
    //       // this.abandonLead(this.modalDecision.lead.id);
    //       this.render();
    //     } else if (this.modalDecision.accept) {
    //       this.modalDecision.refuse = false;
    //       this.modalDecision.lead.type = 'Client';
    //       // this.editLead(this.modalDecision.lead);
    //       this.render();
    //     } else console.log('Failed to make changes');
    //   }
    // );
  }

  @observable selectedLead: ILead | undefined;

  @observable loadingInitial = false;

  @observable showLeadForm = false;

  @observable submitting = false;

  @observable leadRegistry = new Map();

  @observable selectedValue = '';

  @observable rr = false;

  @observable selected: string | null = '';

  @observable confirmation = false;

  @observable progress: number = 20;

  @observable modalDecision = {
    refuse: false,
    accept: false,
    lead: new ContactFormValues(),
  };
  //controls
  @observable allLeads = true;

  @observable status: string = 'all';
  @observable sortBy: string = 'date';

  @observable keepRecords: boolean = true;
  @observable saveContact: boolean = true;
  @observable targetLead: ILead = new Lead();

  @observable contactId: string = '';
  ///////////////////////////////////////

  ///////////
  //Computeds
  //
  @computed get listAxiosParams() {
    const params = new URLSearchParams();
    params.append('allLeads', `${this.allLeads}`);
    params.append('status', `${this.status}`);
    params.append('sortBy', `${this.sortBy}`);
    return params;
  }

  @computed get abandonAxiosParams() {
    const params = new URLSearchParams();
    params.append('id', `${this.contactId}`);
    params.append('keepRecords', `${this.keepRecords}`);
    params.append('saveContact', `${this.saveContact}`);
    return params;
  }

  @computed get leadsList() {
    return Array.from(this.leadRegistry.values());
  }

  @computed get leadsByStatus() {
    var leads: Array<IContact>;
    this.leadRegistry.forEach((lead) => {
      if (lead.status == status) leads.push(lead);
    });
    return;
  }

  /////////
  //Actions
  //
  @action save = (save: boolean) => {
    save ? (this.saveContact = false) : (this.saveContact = true);
  };
  @action keep = (keep: boolean) => {
    keep ? (this.keepRecords = false) : (this.keepRecords = true);
  };
  @action setTargetLead = (lead: ILead) => {
    this.targetLead = lead;
    this.contactId = lead.contact.id;
  };

  @action addLeadForm = () => {
    this.selectedLead = undefined;
    this.selectedValue = '';
    this.showLeadForm = true;
    this.submitting = false;
    this.render();
  };

  @action editLeadForm = (lead: ILead) => {
    this.selectedLead = this.leadRegistry.get(lead.contact.id);
    this.showLeadForm = true;
    this.render();
  };

  @action setShowLeadForm = (show: boolean) => {
    this.showLeadForm = show;
    this.render();
  };

  @action fillForm = () => {
    if (this.selectedLead?.contact) {
      return this.selectedLead.contact;
    }
    return new ContactFormValues();
  };

  // @action transferChanges(refuse: boolean, accept: boolean, lead: IContact) {
  //   this.modalDecision = { refuse, accept, lead };
  //   this.render();
  // }

  @action render() {
    this.rr = !this.rr;
  }

  @action setLeadList = (
    arg: string,
    sortBy: string,
    ev?: EventTarget & HTMLButtonElement
  ) => {
    if (ev != undefined) {
      for (var child of ev?.parentElement!.children)
        child.classList.remove('active');
      ev.classList.add('active');
      // child.getElementsByClassName
    }
    runInAction('Loading leads', () => {
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

  @action loadLeads = async () => {
    try {
      const leads = await agent.Leads.list(this.listAxiosParams);
      this.leadRegistry.clear();
      runInAction('Loading leads', () => {
        leads.forEach((lead) => {
          this.leadRegistry.set(lead.contact.id, lead);
        });
        this.loadingInitial = false;
        this.submitting = false;
      });
      this.render();
    } catch (error) {
      runInAction('Loading error', () => {
        this.loadingInitial = false;
        this.submitting = false;
      });
      console.log(error);
    }
  };

  @action addLead = async (values: ILead) => {
    this.submitting = true;
    let lead = values;
    try {
      await agent.Leads.add(lead);
      runInAction('Loading leads', () => {
        this.leadRegistry.set(lead.contact.id, lead);
        this.showLeadForm = false;
        this.submitting = false;
      });
      toast.success('Lead added');
      //reload list with status of added lead
      this.setLeadList(lead.contact.status, this.sortBy);
    } catch (error) {
      runInAction('Loading leads', () => {
        this.submitting = false;
      });
      console.log(error);
    }
  };

  @action changeLeadStatus = async (lead: ILead, upgrade: boolean) => {
    this.submitting = true;
    try {
      await agent.Leads.changeStatus(lead.contact.id, upgrade);
      this.loadLeads();
    } catch (error) {
      runInAction('Loading error', () => {
        this.loadingInitial = false;
        this.submitting = false;
      });
      console.log(error);
      toast.error(error.data.errors);
    }
  };

  @action editLead = async (lead: ILead) => {
    this.submitting = true;
    if (this.selectedLead !== lead) {
      try {
        await agent.Contacts.update(lead.contact);
        runInAction('Loading contacts', () => {
          this.leadRegistry.set(lead.contact.id, lead);
          this.showLeadForm = false;
          this.submitting = false;
        });
        this.render();
      } catch (error) {
        runInAction('Loading contacts', () => {
          this.submitting = false;
        });
        toast.error('Problem occured');
        console.log(error);
      }
    } else {
      this.showLeadForm = false;
      this.submitting = false;
      this.render();
    }
  };

  @action abandonLead = async () => {
    this.submitting = true;
    try {
      await agent.Leads.abandonLead(this.abandonAxiosParams);
      this.loadLeads();
      runInAction('Loading leads', () => {
        this.leadRegistry.delete(this.contactId);
        this.selectedLead = undefined;
        this.submitting = false;
      });
      toast.success('Lead has been removed');
      this.render();
    } catch (error) {
      runInAction('Loading error', () => {
        this.submitting = false;
      });
      console.log(error);
    }
  };

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
}
