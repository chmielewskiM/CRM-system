import {
  observable,
  action,
  computed,
  runInAction,
  reaction,
  makeObservable,
} from 'mobx';
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
import { Console } from 'node:console';

//number of returned contacts
const PAGE_SIZE = 10;

export default class ContactStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    makeObservable(this, {
      contact: observable,
      selectedContact: observable,
      selectedValue: observable,
      contacts: observable,
      contactRegistry: observable,
      uncontractedRegistry: observable,
      loadingInitial: observable,
      showContactForm: observable,
      shareContactForm: observable,
      submitting: observable,
      contactsTotal: observable,
      premium: observable,
      inProcess: observable,
      filterInput: observable,
      orderBy: observable,
      sortDescending: observable,
      activePage: observable,
      uncontracted: observable,
      axiosParams: computed,
      contactsList: computed,
      uncontractedContacts: computed,
      convertPremiumValue: computed,
      setPagination: action,
      setOrderBy: action,
      handleSearch: action,
      setContactList: action,
      selectContact: action,
      addContactForm: action,
      editContactForm: action,
      setShowContactForm: action,
      showShareContactForm: action,
      fillForm: action,
      loadContacts: action,
      loadUncontracted: action,
      addContact: action,
      editContact: action,
      removeContact: action,
      premiumUpgrade: action,
      shareContact: action,
      startSaleProcess: action,
      getContact: action,
      addFake: action,
    });

    this.rootStore = rootStore;
    reaction(
      () => this.axiosParams,
      () => {
        this.loadContacts();
      }
    );
  }

  /////////////////////////////////////
  //collections
  contacts: IContact[] = [];
  contactRegistry = new Map();
  uncontractedRegistry = new Map();
  //instances
  contact: IContact | undefined;
  selectedContact: IContact | undefined;
  //controls
  loadingInitial = false;
  submitting = false;
  showContactForm = false;
  shareContactForm = false;
  selectedValue = '';
  //URLparams
  premium: boolean = false;
  inProcess: boolean = false;
  filterInput: string = 'unfiltered';
  orderBy = 'date';
  sortDescending = true;
  uncontracted = false;
  //pagination
  contactsTotal = 0;
  activePage = 0;
  //----------------------------------------------------

  ////
  // *Functions*
  //
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
  //
  get axiosParams() {
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

  get contactsList() {
    return Array.from(this.contactRegistry.values());
  }

  //Uncontracted contacts are those, whom we are ready to create a new order with.
  //It means that they don't have any open order assigned.
  get uncontractedContacts() {
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

  get convertPremiumValue() {
    if (
      String(this.selectedContact?.premium) == 'True' ||
      this.selectedContact?.premium == true
    )
      return true;
    else return false;
  }

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

  selectContact = (id: string) => {
    runInAction(() => {
      if (id !== '') {
        this.selectedContact = this.contactRegistry.get(id);
        this.contact = this.selectedContact;
      } else {
        this.selectedContact = undefined;
      }
    });
  };

  //filters and pagination
  setPagination = (modifier: number) => {
    runInAction(() => {
      this.activePage += modifier;
    });
  };

  setOrderBy = (value: string) => {
    runInAction(() => {
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

  handleSearch = (ev: SyntheticEvent, input: InputOnChangeData) => {
    runInAction(() => {
      if (input.value.length > 1) {
        this.filterInput = input.value;
      } else this.filterInput = 'unfiltered';
    });
  };

  setContactList = (arg: string, ev?: EventTarget & HTMLButtonElement) => {
    if (ev != undefined) {
      for (var child of ev?.parentElement!.children)
        child.classList.remove('active');
      ev.classList.add('active');
    }

    runInAction(() => {
      this.activePage = 0;
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
  };
  //----------------------------------------

  // *Forms*
  addContactForm = () => {
    this.loadingData(true);
    runInAction(() => {
      this.selectedContact = undefined;
      this.selectedValue = '';
      this.showContactForm = true;
    });
    this.loadingData(false);
  };

  editContactForm = (id: string) => {
    runInAction(() => {
      this.selectedContact = this.contactRegistry.get(id);
      this.showContactForm = true;
    });
  };

  setShowContactForm = (show: boolean) => {
    runInAction(() => {
      this.showContactForm = show;
    });
  };

  showShareContactForm = (show: boolean, contact?: IContact) => {
    runInAction(() => {
      this.selectedContact = contact;
      this.shareContactForm = show;
    });
  };

  fillForm = () => {
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
  //----------------------------------------

  // *CRUD contact*
  loadContacts = async () => {
    this.loadingData(true);
    try {
      const contacts = await agent.Contacts.listContacts(this.axiosParams);
      const { ...data } = contacts;
      runInAction(() => {
        this.contactRegistry.clear();
        data.contacts.forEach((contact: IContact) => {
          this.contactRegistry.set(contact.id, contact);
        });
        this.contactsTotal = data.contactsTotal;
      });
      this.loadingData(false);
    } catch (error) {
      this.loadingData(false);
      console.log(error);
    }
  };

  loadUncontracted = async () => {
    runInAction(() => {
      this.uncontracted = true;
      this.orderBy = 'name_asc';
    });
    try {
      const contacts = await agent.Contacts.listContacts(this.axiosParams);
      const { ...data } = contacts;
      runInAction(() => {
        this.uncontractedRegistry.clear();
        data.contacts.forEach((contact: IContact) => {
          this.uncontractedRegistry.set(contact.id, contact);
        });
        this.uncontracted = false;
      });
    } catch (error) {
      runInAction(() => {
        this.uncontracted = false;
      });
      console.log(error);
    }
  };

  addContact = async (contact: IContact) => {
    this.submittingData(true);
    try {
      await agent.Contacts.addContact(contact);
      runInAction(() => {
        this.contactRegistry.set(contact.id, contact);
        toast.success('Contact added');
        this.showContactForm = false;
      });
      this.submittingData(false);
      this.loadContacts();
    } catch (error) {
      this.submittingData(false);
      toast.error(this.rootStore.commonStore.handleErrorMessage(error));
      console.log(error);
    }
  };

  editContact = async (contact: ContactFormValues) => {
    this.submittingData(true);
    if (this.contact == this.selectedContact) {
      try {
        await agent.Contacts.updateContact(contact);
        runInAction(() => {
          this.contactRegistry.set(contact.id, contact);
        });
        this.setShowContactForm(false);
        this.submittingData(false);
        toast.success('Contact updated successfully.');
      } catch (error) {
        this.submittingData(false);
        toast.error(this.rootStore.commonStore.handleErrorMessage(error));
        console.log(error);
      }
    } else {
      this.showContactForm = false;
      this.submittingData(false);
    }
  };

  removeContact = async (id: string) => {
    this.submittingData(true);
    try {
      await agent.Contacts.unshareContact(id);
      runInAction(() => {
        this.contactRegistry.delete(this.selectedContact!.id);
        this.selectedContact = undefined;
      });
      this.submittingData(false);
      toast.success('Contact deleted successfully.');
    } catch (error) {
      toast.error(error.data.errors.message);
      this.submittingData(false);
      console.log(error);
    }
  };

  premiumUpgrade = async (contact: IContact) => {
    this.submittingData(true);
    try {
      await agent.Contacts.upgradeToPremium(contact);
      runInAction(() => {
        contact.premium =
          String(contact.premium) == 'True' || contact.premium == true;
        this.selectedContact!.premium = !contact.premium;
      });
      this.submittingData(false);
      await this.loadContacts();

      if (contact.premium)
        toast.success(`${contact.name} is now premium member.`);
      else toast.info(`${contact.name} is no longer premium member.`);
    } catch (error) {
      this.submittingData(false);
      console.log(error);
      toast.error('The upgrade failed');
    }
  };

  shareContact = async (contactId: string, user: IUserFormValues) => {
    this.submittingData(true);
    // await agent.Contacts.share(taskId, user);
    toast.success(
      'Shared ' + this.selectedContact?.type + ' with ' + user.username
    );
    try {
      runInAction(() => {
        this.selectedContact = undefined;
        this.shareContactForm = false;
      });
      this.submittingData(false);
    } catch (error) {
      this.submittingData(false);
      console.log(error);
    }
    this.setContactList('myContacts');
  };

  startSaleProcess = async () => {
    this.submittingData(true);
    let lead = new LeadFormValues();
    lead.contact = this.selectedContact!;
    lead.contact.source = 'Former Client';
    lead.order!.clientId = lead.contact.id;
    lead.order!.id = uuid();
    await agent.Contacts.startSaleProcess(lead.contact);
    this.submittingData(false);
    this.loadContacts();
  };

  getContact = async (name: string) => {
    if (name) {
      try {
        let contact = new ContactFormValues();
        contact = await agent.Contacts.getContact(encodeURI(name));
        runInAction(() => {
          this.selectedContact = new ContactFormValues(contact);
          // this.rootStore.orderStore.selectedClient = contact.name;
        });
        //
      } catch (error) {
        console.log(error);
      }
    }
  };
  //----------------------------------------

  //FAKER
  addFake = async (contact: IContact) => {
    this.submittingData(true);
    var date = new Date(Date.now());
    contact.dateAdded = date;
    try {
      await agent.Contacts.addContact(contact);
      runInAction(() => {
        this.contactRegistry.set(contact.id, contact);
        toast.success('Contact added');
        this.showContactForm = false;
      });
      this.submittingData(false);
      this.loadContacts();
    } catch (error) {
      this.submittingData(false);
      console.log(error);
    }
  };
  ////
  //Faker
  // fakeContacts = async () => {
  //   var faker = require('faker');
  //   const types = [
  //     'Client',
  //     'Team',
  //     'Supplier',
  //     'Inactive',
  //     'Shipment',
  //     'Other',
  //   ];
  //   const sources = [
  //     'Web',
  //     'Social Media',
  //     'Flyers',
  //     'Commercial',
  //     'Former Client',
  //   ];

  //   var randomName = faker.name.findName(); // Rowan Nikolaus
  //   var randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
  //   var randomCard = faker.helpers.createCard(); // random contact card containing many properties

  //   for (let i = 0; i < 30; i++) {
  //     let randType = Math.floor(Math.random() * 6);
  //     let randSource = Math.floor(Math.random() * 5);
  //     let contact = new ContactFormValues();
  //     contact.id = uuid();
  //     contact.name = `${faker.name.firstName()} ${faker.name.lastName()}`;
  //     contact.type = types[randType];
  //     contact.source = types[randSource];
  //     if (i % 5 == 0) contact.premium = true;
  //     contact.notes = faker.lorem.sentences();
  //     contact.phoneNumber = faker.phone.phoneNumber('+28 ### ### ###');
  //     contact.status = 'Inactive';
  //     contact.successfulDeals = randType;
  //     contact.company = faker.company.companyName();
  //     contact.dateAdded = faker.date.past();
  //     contact.email = faker.internet.email();
  //     await this.addContact(contact);
  //   }
  // };
}
