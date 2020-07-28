import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, FormEvent } from "react";
import { IContact } from "../models/contact";
import agent from "../api/agent";

configure({ enforceActions: "always" });

class ContactStore {
  @observable contacts: IContact[] = [];
  @observable selectedContact: IContact | undefined;
  @observable loadingInitial = false;
  @observable showForm = false;
  @observable submitting = false;
  @observable contactRegistry = new Map();
  @observable selectedValue: string = "";

  @computed get contactsByDate() {
    return Array.from(this.contactRegistry.values())
      .slice(0)
      .sort((a, b) => Date.parse(b.dateAdded) - Date.parse(a.dateAdded));
  }

  @action loadContacts = async () => {
    this.loadingInitial = true;
    try {
      const contacts = await agent.Contacts.list();
      runInAction("Loading contacts", () => {
        contacts.forEach((contact) => {
          this.contactRegistry.set(contact.id, contact);
        });
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction("Loading error", () => {
        this.loadingInitial = false;
      });
      console.log(error);
    }
  };

  @action selectContact = (id: string) => {
    if (id !== "") {
      this.selectedContact = this.contactRegistry.get(id);
      this.selectedValue = this.selectedContact!.type;
    } else {
      this.selectedContact = undefined;
    }
  };

  @action addContactForm = () => {
    this.selectedContact = undefined;
    this.selectedValue = "";
    this.showForm = true;
  };

  @action editContactForm = (id: string) => {
    this.selectedContact = this.contactRegistry.get(id);
    this.selectedValue = this.selectedContact!.type;
    this.showForm = true;
  };

  @action setShowForm = (show: boolean) => {
    this.showForm = show;
  };

  @action updateFormSelect = async (selection: string) => {
    this.selectedValue = selection;
    return this.selectedValue;
  };

  @action addContact = async (contact: IContact) => {
    this.submitting = true;
    contact.dateAdded = new Date().toISOString();
    try {
      contact.type = this.selectedValue;
      await agent.Contacts.add(contact);
      runInAction("Loading contacts", () => {
        this.contactRegistry.set(contact.id, contact);
        this.showForm = false;
        this.submitting = false;
      });
    } catch (error) {
      runInAction("Loading contacts", () => {
        this.submitting = false;
      });
      console.log(error);
    }
  };

  @action editContact = async (contact: IContact) => {
    this.submitting = true;

    if (this.selectedContact !== contact || this.selectedValue !== contact.type) {
      try {
        contact.type = this.selectedValue;
        await agent.Contacts.update(contact);
        runInAction("Loading contacts", () => {
          this.contactRegistry.set(contact.id, contact);
          this.selectedContact = contact;
          this.showForm = false;
          this.submitting = false;
        });
      } catch (error) {
        runInAction("Loading contacts", () => {
          this.submitting = false;
        });
        console.log(error);
      }
    } else {
      console.log("nie zmieniono kontaktu");
      this.showForm = false;
      this.submitting = false;
    }
  };

  @action deleteContact = async (id: string) => {
    this.submitting = true;
    try {
      await agent.Contacts.delete(id);
      runInAction("Loading contacts", () => {
        this.contactRegistry.delete(this.selectedContact!.id);
        this.selectedContact = undefined;
        this.submitting = false;
      });
    } catch (error) {
      runInAction("Loading contacts", () => {
        this.submitting = false;
      });
      console.log(error);
    }
  };
}

export default createContext(new ContactStore());
