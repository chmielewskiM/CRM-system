import { observable, action, computed, runInAction } from 'mobx';
import { toast } from 'react-toastify';
import { IContact, ContactFormValues } from '../models/contact';
import agent from '../api/agent';
import { RootStore } from './rootStore';
import { v4 as uuid } from 'uuid';

export default class ContactStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable contacts: IContact[] = [];

  @observable contact: IContact | undefined;

  @observable selectedContact: IContact | undefined;

  @observable loadingInitial = false;

  @observable showContactForm = false;

  @observable submitting = false;

  @observable contactRegistry = new Map();

  @observable selectedValue = '';

  @observable rr = false;

  @action render() {
    this.rr = !this.rr;
  }

  @computed get contactsByDate() {
    // console.log(Array.from(this.contactRegistry.values()))
    // console.log(this.contactRegistry)
    
    return Array.from(this.contactRegistry.values())
      .slice(0)
      .sort((a, b) => Date.parse(b.dateAdded) - Date.parse(a.dateAdded));
  }

  @computed get contactsByName() {
    let contact;
    let contacts: Array<Object> = [];
    let list = Array.from(this.contactRegistry.values());
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
  @action loadContacts = async () => {
    this.loadingInitial = true;
    try {
      const contacts = await agent.Contacts.list();
      runInAction('Loading contacts', () => {
        contacts.forEach((contact) => {
          this.contactRegistry.set(contact.id, contact);
        });
        // console.log(this.contactRegistry)
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

  @action getContact = async (name: string) => {
    if (name) {
      try {
        let contact = new ContactFormValues();
        // console.log(name)
        
        contact = await agent.Contacts.get(encodeURI(name));
        
        runInAction(() => {
          this.selectedContact = new ContactFormValues(contact);
          // this.rootStore.orderStore.selectedClient = contact.name;
        });
        // console.log(this.selectedContact)
        // this.render();
      } catch (error) {
        console.log(error);
      }
    }
  };
  @action selectContact = (id: string) => {
    if (id !== '') {
      this.selectedContact = this.contactRegistry.get(id);
      this.contact = this.selectedContact;
      // this.render();
    } else {
      this.selectedContact = undefined;
      this.render();
    }
  };

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

  @action fillForm = () => {
    if (this.selectedContact) {
      return this.selectedContact;
    }
    return new ContactFormValues();
  };
  handleFinalFormSubmit = (values: any) => {
    const { ...contact } = values;
    console.log(values)
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
        this.render();
      });
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
          this.render();
        });
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

  @action deleteContact = async (id: string) => {
    this.submitting = true;
    try {
      await agent.Contacts.delete(id);
      runInAction('Loading contacts', () => {
        this.contactRegistry.delete(this.selectedContact!.id);
        this.selectedContact = undefined;
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
}
