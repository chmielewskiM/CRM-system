import { observable, action, computed, runInAction, reaction } from 'mobx';
import { toast } from 'react-toastify';
import { IContact, ContactFormValues } from '../models/contact';
import agent from '../api/agent';
import { RootStore } from './rootStore';
import { v4 as uuid } from 'uuid';
import { SyntheticEvent } from 'react';
import { InputOnChangeData } from 'semantic-ui-react';
import { IUserFormValues } from '../models/user';
import { LeadFormValues } from '../models/lead';
import { getuid } from 'process';

//number of returned contacts
const PAGE_SIZE = 10;

export default class ContactStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    reaction(
      () => this.contactsParams,
      () => {
        this.loadContacts();
      }
    );
  }

  ////
  //***Observables***
  ////

  @observable contact: IContact | undefined;

  @observable selectedContact: IContact | undefined;

  @observable selectedValue = '';

  @observable rr = false;
  //----------------------------------------------------

  //-collections
  @observable contacts: IContact[] = [];

  @observable contactRegistry = new Map();

  @observable uncontractedRegistry = new Map();
  //----------------------------------------------------

  //-controls
  @observable loadingInitial = false;

  @observable showContactForm = false;

  @observable shareContactForm = false;

  @observable submitting = false;

  @observable contactsTotal = 0;
  //----------------------------------------------------

  //-filtering&sorting, URLparams
  @observable premium: boolean = false;

  @observable inProcess: boolean = false;

  @observable filterInput: string = 'unfiltered';

  @observable orderBy = 'date';

  @observable sortDescending = true;

  @observable activePage = 0;

  @observable uncontracted = false;
  //----------------------------------------------------

  handleContact = (arg: string, contact: IContact) => {
    switch (arg) {
      case 'share':
        this.showShareContactForm(true, contact);
        break;
      case 'edit':
        this.editContactForm(contact.id);
        break;
      case 'delete':
        this.removeContact(contact.id);
        break;
    }
  };

  ////
  // *Computeds*
  ////
  @computed get contactsParams() {
    const params = new URLSearchParams();
    params.append('premium', `${this.premium}`);
    params.append('inProcess', `${this.inProcess}`);
    params.append('filterInput', `${this.filterInput}`);
    params.append('pageSize', `${PAGE_SIZE}`);
    params.append('activePage', `${this.activePage}`);
    params.append('orderBy', `${this.orderBy}`);
    params.append('uncontracted', `${this.uncontracted}`);
    return params;
  }

  @computed get contactsList() {
    return Array.from(this.contactRegistry.values());
  }

  //Uncontracted contacts are those, whom we are ready to create a new order with.
  //It means that they don't have any open order assigned.
  @computed get uncontractedContacts() {
    let contact;
    let contacts: Array<Object> = [];
    let list = Array.from(this.uncontractedRegistry.values());

    list.map((c, el) => {
      contact = {
        key: c.id,
        text: c.name,
        value: c.name,
      };
      contacts.push(contact);
    });

    return contacts;
  }

  @computed get convertPremiumValue() {
    let value;
    if (
      String(this.selectedContact?.premium) == 'True' ||
      this.selectedContact?.premium == true
    )
      value = true;
    else value = false;

    return value;
  }

  ////
  // *Actions*
  ////

  @action render() {
    this.rr = !this.rr;
  }

  ////
  //-Filters and pagination

  @action setPagination = (modifier: number) => {
    this.activePage += modifier;
    this.loadContacts();
  };

  @action setOrderBy = (value: string) => {
    runInAction('Sorting orders', () => {
      this.sortDescending = !this.sortDescending;
      let orderBy;
      if (!this.sortDescending) {
        orderBy = value.concat('_desc');
      } else {
        orderBy = value.concat('_asc');
      }
      this.orderBy = orderBy;
    });
  };

  @action handleSearch = (ev: SyntheticEvent, input: InputOnChangeData) => {
    runInAction('Filtering orders', () => {
      if (input.value.length > 1) {
        this.filterInput = input.value;
      } else this.filterInput = 'unfiltered';
      this.loadContacts();
    });
  };

  @action setContactList = (
    arg: string,
    ev?: EventTarget & HTMLButtonElement
  ) => {
    if (ev != undefined) {
      for (var child of ev?.parentElement!.children)
        child.classList.remove('active');
      ev.classList.add('active');
    }
    runInAction('Setting list', () => {
      switch (arg) {
        case 'all':
          this.inProcess = false;
          this.premium = false;
          break;
        case 'inProcess':
          this.inProcess = true;
          this.premium = false;
          break;
        case 'premium':
          this.inProcess = false;
          this.premium = true;
          break;
      }
    });
    this.loadContacts();
  };
  //////////////////////////////////////////////

  @action selectContact = (id: string) => {
    if (id !== '') {
      var a = this.contactRegistry.get(id);
      this.selectedContact = this.contactRegistry.get(id);
      this.contact = this.selectedContact;
    } else {
      this.selectedContact = undefined;
    }
    this.render();
  };

  ////
  //-Forms

  @action addContactForm = () => {
    this.selectedContact = undefined;
    this.selectedValue = '';
    this.showContactForm = true;
    this.submitting = false;
    this.render();
  };

  @action editContactForm = (id: string) => {
    this.selectedContact = this.contactRegistry.get(id);
    this.showContactForm = true;
    this.render();
  };

  @action setShowContactForm = (show: boolean) => {
    this.showContactForm = show;
    this.render();
  };

  @action showShareContactForm = (show: boolean, contact?: IContact) => {
    this.selectedContact = contact;
    this.shareContactForm = show;
    this.render();
  };

  @action fillForm = () => {
    if (this.selectedContact) {
      return this.selectedContact;
    }
    return new ContactFormValues();
  };

  handleFinalFormSubmit = (values: any) => {
    const { ...contact } = values;
    if (!contact.id) {
      let newContact = {
        ...contact,
        id: uuid(),
      };
      this.addContact(newContact);
    } else {
      this.editContact(contact);
    }
  };
  /////////////////////////////////////////

  //////
  //-CRUD

  @action loadContacts = async () => {
    this.loadingInitial = true;
    try {
      const contacts = await agent.Contacts.listContacts(this.contactsParams);
      const { ...data } = contacts;
      this.contactRegistry.clear();
      runInAction('Loading contacts', () => {
        data.contacts.forEach((contact: IContact) => {
          this.contactRegistry.set(contact.id, contact);
        });
        this.contactsTotal = data.contactsTotal;
        this.loadingInitial = false;
      });
      this.render();
    } catch (error) {
      runInAction('Loading error', () => {
        this.loadingInitial = false;
      });
      console.log(error);
    }
  };

  @action loadUncontracted = async () => {
    this.uncontracted = true;
    this.orderBy = 'name_asc';
    try {
      const contacts = await agent.Contacts.listContacts(this.contactsParams);
      const { ...data } = contacts;
      this.uncontractedRegistry.clear();
      runInAction('Loading contacts', () => {
        data.contacts.forEach((contact: IContact) => {
          this.uncontractedRegistry.set(contact.id, contact);
        });
        this.uncontracted = false;
        this.render();
      });
    } catch (error) {
      runInAction('Loading error', () => {
        this.uncontracted = false;
      });
      console.log(error);
    }
  };

  @action addContact = async (contact: IContact) => {
    this.submitting = true;
    var date = new Date(Date.now());
    contact.dateAdded = date;
    try {
      await agent.Contacts.add(contact);
      runInAction('Loading contacts', () => {
        this.contactRegistry.set(contact.id, contact);
        toast.success('Contact added');
        this.showContactForm = false;
        this.submitting = false;
      });
      this.loadContacts();
    } catch (error) {
      runInAction('Loading contacts', () => {
        this.submitting = false;
      });
      console.log(error);
    }
  };

  @action editContact = async (contact: ContactFormValues) => {
    this.submitting = true;

    if (this.contact == this.selectedContact) {
      try {
        await agent.Contacts.update(contact);
        runInAction('Loading contacts', () => {
          this.contactRegistry.set(contact.id, contact);
          this.showContactForm = false;
          this.submitting = false;
        });
        this.render();
      } catch (error) {
        runInAction('Loading contacts', () => {
          this.submitting = false;
        });
        toast.error('Problem occured');
      }
    } else {
      toast.info('No changes');
      this.showContactForm = false;
      this.submitting = false;
      this.render();
    }
  };

  @action removeContact = async (id: string) => {
    this.submitting = true;
    try {
      await agent.Contacts.unshare(id);
      runInAction('Removing contact', () => {
        this.contactRegistry.delete(this.selectedContact!.id);
        this.selectedContact = undefined;
        this.submitting = false;
      });
      this.render();
    } catch (error) {
      
      toast.error(error.data.errors.error);
      runInAction('Loading contacts', () => {
        this.submitting = false;
        this.render();
      });
      console.log(error);
    }
  };

  @action premiumUpgrade = async (contact: IContact) => {
    this.submitting = true;
    try {
      await agent.Contacts.upgradeToPremium(contact);

      runInAction('Upgrading contact to premium', () => {
        contact.premium =
          String(contact.premium) == 'True' || contact.premium ? false : true;

        this.selectedContact!.premium = contact.premium;
        this.contactRegistry.set(contact.id, contact);
        this.submitting = false;
      });
      if (contact.premium)
        toast.success(`${contact.name} is now premium member.`);
      else toast.info(`${contact.name} is not premium member anymore.`);

      this.loadContacts();
    } catch (error) {
      runInAction('Loading contacts', () => {
        this.submitting = false;
      });
      console.log(error);
      toast.error('The upgrade failed');
    }
  };

  @action shareContact = async (contactId: string, user: IUserFormValues) => {
    this.submitting = true;
    // await agent.Contacts.share(taskId, user);
    toast.success(
      'Shared ' + this.selectedContact?.type + ' with ' + user.username
    );
    try {
      runInAction('Loading delegatedContacts', () => {
        this.selectedContact = undefined;
        this.shareContactForm = false;
        this.submitting = false;
      });
    } catch (error) {
      console.log(error);
    }
    this.setContactList('myContacts');
  };

  @action startSaleProcess = async () => {
    let lead = new LeadFormValues();
    lead.contact = this.selectedContact!;
    lead.contact.source = 'Former Client';
    lead.order!.clientId = lead.contact.id;
    lead.order!.id = uuid();
    await this.rootStore.leadStore.addLead(lead);
    this.loadContacts();
  };

  @action getContact = async (name: string) => {
    if (name) {
      try {
        let contact = new ContactFormValues();
        contact = await agent.Contacts.get(encodeURI(name));
        runInAction(() => {
          this.selectedContact = new ContactFormValues(contact);
          // this.rootStore.orderStore.selectedClient = contact.name;
        });
        // this.render();
      } catch (error) {
        console.log(error);
      }
    }
  };
  //////////////////////////////////////////////////
}
