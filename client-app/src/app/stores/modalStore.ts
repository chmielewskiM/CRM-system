import { RootStore } from './rootStore';
import { observable, action, makeObservable } from 'mobx';
import { IContact, ContactFormValues } from '../models/contact';

export default class ModalStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    makeObservable(this, {
      triggeredFunction: observable,
      contact: observable,
      rr: observable,
      returned: observable,
      final: observable,
      doubleCheckContent: observable,
      firstCheck: observable,
      accept: observable,
      refusal: observable,
      abandonModal: observable,
      render: action,
      modal: observable.shallow,
      openModal: action,
      closeModal: action,
      confirmModal: action
    });

    this.rootStore = rootStore;
  }

  triggeredFunction: string = '';

  contact = new ContactFormValues();

  rr = false;

  returned: any;

  final = false;

  doubleCheckContent = '';

  firstCheck = false;

  accept: boolean = false;

  refusal: boolean = false;

  abandonModal:boolean = false;

  render() {
    this.rr = !this.rr;
  }

  modal = {
    open: false,
    body: null,
  };

  openModal = (content: any, type?: string) => {
    this.modal.open = true;
    type == 'abandon' ? this.abandonModal = true : this.abandonModal = false;
    this.modal.body = content;
    this.rr = !this.rr;
  };

  closeModal = async () => {
    this.modal.open = false;
    this.modal.body = null;
    // if (this.firstCheck) this.refuse();
    this.final = false;
    this.firstCheck = false;
    this.rr = !this.rr;
  };

  confirmModal = (contact: IContact) => {
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
