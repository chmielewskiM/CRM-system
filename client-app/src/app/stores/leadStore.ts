import { observable, action, computed, runInAction, reaction } from 'mobx';
import { toast } from 'react-toastify';
import { IContact, ContactFormValues } from '../models/contact';
import agent from '../api/agent';
import { RootStore } from './rootStore';
import { IOperation } from '../models/operation';

export default class LeadStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    reaction(
      () => this.modalDecision,
      () => {
        if (this.modalDecision.refuse) {
          this.modalDecision.refuse = false;
          this.deleteLead(this.modalDecision.lead.id);
          this.render();
        } else if (this.modalDecision.accept) {
          this.modalDecision.refuse = false;
          this.modalDecision.lead.type = 'Client';
          this.editLead(this.modalDecision.lead);
          this.render();
        } else console.log('Failed to make changes');
      }
    );
  }

  @observable contacts: IContact[] = [];

  @observable selectedLead: IContact | undefined;

  @observable loadingInitial = false;

  @observable showLeadForm = false;

  @observable submitting = false;

  @observable contactRegistry = new Map();

  @observable selectedValue = '';

  @observable rr = false;

  @observable selected: string | null = '';

  @observable status: string = '';

  @observable confirmation = false;

  @observable progress: number = 20;

  @observable modalDecision = {
    refuse: false,
    accept: false,
    lead: new ContactFormValues(),
  };
  @action transferChanges(refuse: boolean, accept: boolean, lead: IContact) {
    this.modalDecision = { refuse, accept, lead };
    this.render();
  }
  @action render() {
    this.rr = !this.rr;
  }
  handleSettings = (opt: string, contact: IContact) => {
    if (opt === 'details') console.log('show details');
    else if (opt === 'upgrade') this.changeStatus(contact, 1);
    else if (opt === 'downgrade') this.changeStatus(contact, -1);
  };
  statuses = [
    { key: 'Inactive', value: 0 },
    { key: 'Active', value: 1 },
    { key: 'Opportunity', value: 2 },
    { key: 'Quote', value: 3 },
    { key: 'Invoice', value: 4 },
  ];
  @action changeStatus = async (contact: IContact, modifier: number) => {
    this.loadingInitial = true;
    var c = this.statuses.find((el: { key: string; value: number }) => {
      if (el.key == contact.status) {
        return (contact.status = this.statuses[el.value + modifier].key);
      }
    });
    await this.editLead(contact);
    this.loadLeads(contact.status);
  };

  @computed get contactsByDate() {
    return Array.from(this.contactRegistry.values())
      .slice(0)
      .sort((a, b) => Date.parse(b.dateAdded) - Date.parse(a.dateAdded));
  }

  @computed get leadsByStatus() {
    var contacts: Array<IContact>;
    this.contactRegistry.forEach((contact) => {
      if (contact.status == status) contacts.push(contact);
    });
    return;
  }
  @action loadLeads = async (status: string) => {
    this.loadingInitial = true;
    try {
      const contacts = await agent.Leads.list();
      this.contactRegistry.clear();
      runInAction('Loading contacts', () => {
        contacts.forEach((contact) => {
          if (contact.status == status) this.contactRegistry.set(contact.id, contact);
        });
        this.status = status;
        this.loadingInitial = false;
        this.render();
      });
    } catch (error) {
      runInAction('Loading error', () => {
        this.loadingInitial = false;
      });
      console.log(error);
    }
  };

  @action selectLead = (id: string) => {
    if (id !== '') {
      this.selectedLead = this.contactRegistry.get(id);
      this.render();
    } else {
      this.selectedLead = undefined;
      this.render();
    }
  };

  @action addLeadForm = () => {
    this.selectedLead = undefined;
    this.selectedValue = '';
    this.showLeadForm = true;
    this.submitting = false;
    this.render();
  };

  @action editLeadForm = (id: string) => {
    this.selectedLead = this.contactRegistry.get(id);
    this.showLeadForm = true;
    this.render();
  };

  @action setShowLeadForm = (show: boolean) => {
    this.showLeadForm = show;
    this.render();
  };

  @action fillForm = () => {
    if (this.selectedLead) {
      return this.selectedLead;
    }
    return new ContactFormValues();
  };

  @action addLead = async (contact: IContact) => {
    this.submitting = true;
    let newStat = this.rootStore.commonStore.newStatistic('lead')
    var date = new Date(Date.now());
    contact.dateAdded = date;
    contact.status = 'Active';
    contact.type = 'Lead';
    console.log(newStat)
    try {
      await agent.Leads.add(contact).then(()=> agent.Operations.add(newStat!));
      runInAction('Loading contacts', () => {
        this.contactRegistry.set(contact.id, contact);
        toast.success('Lead added');
        this.showLeadForm = false;
        this.submitting = false;
        this.render();
      });
    } catch (error) {
      runInAction('Loading contacts', () => {
        this.submitting = false;
      });
      console.log(error);
    }
    this.loadLeads('Active');
  };

  @action editLead = async (contact: ContactFormValues) => {
    this.submitting = true;

    if (this.selectedLead !== contact) {
      try {
        await agent.Leads.update(contact);
        runInAction('Loading contacts', () => {
          this.contactRegistry.set(contact.id, contact);
          this.showLeadForm = false;
          this.submitting = false;
          this.render();
        });
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

  @action deleteLead = async (id: string) => {
    this.submitting = true;
    try {
      await agent.Leads.delete(id);
      runInAction('Loading contacts', () => {
        this.contactRegistry.delete(id);
        this.selectedLead = undefined;
        this.submitting = false;

        this.render();
      });
    } catch (error) {
      runInAction('Loading contacts', () => {
        this.submitting = false;
      });
      console.log(error);
    }
  };

  @action focused = (progress: number) => {
    const target = event!.target as HTMLButtonElement;
    target.parentElement?.childNodes.forEach((child) => {
      var el = child as HTMLElement;
      el.classList.remove('focused');
    });
    target.classList.add('focused');
    this.progress = progress;
  };
}
