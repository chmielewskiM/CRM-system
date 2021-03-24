import { RootStore } from './rootStore';
import { observable, action } from 'mobx';
import { IContact, ContactFormValues } from '../models/contact';

export default class ModalStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable triggeredFunction: string = '';

  @observable contact = new ContactFormValues();

  @observable rr = false;

  @observable returned: any;

  @observable final = false;

  @observable doubleCheckContent = '';

  @observable firstCheck = false;

  @observable accept: boolean = false;

  @observable refusal: boolean = false;

  @observable abandonModal:boolean = false;

  @action render() {
    this.rr = !this.rr;
  }

  @observable.shallow modal = {
    open: false,
    body: null,
  };

  @action openModal = (content: any, type?: string) => {
    this.modal.open = true;
    type == 'abandon' ? this.abandonModal = true : this.abandonModal = false;
    this.modal.body = content;
    this.rr = !this.rr;
  };

  @action closeModal = async () => {
    this.modal.open = false;
    this.modal.body = null;
    // if (this.firstCheck) this.refuse();
    this.final = false;
    this.firstCheck = false;
    this.rr = !this.rr;
  };

  @action confirmModal = (contact: IContact) => {
    this.contact = contact;
    // this.firstCheck = true;
    // this.handleDoubleCheck();
    this.rr = !this.rr;
  };

  // @action handleDoubleCheck = () => {
  //   if (!this.final) {
  //     this.final = true;
  //     this.openModal(this.doubleCheckContent, this.triggeredFunction, '');
  //   } else {
  //     this.accepted();
  //     this.firstCheck = false;
  //     this.closeModal();
  //   }
  // };

  // @action refuse = () => {
  //   this.rootStore.leadStore.transferChanges(true, false, this.contact);
  // };

  // @action accepted = () => {
  //   this.rootStore.leadStore.transferChanges(false, true, this.contact);
  // };
}
