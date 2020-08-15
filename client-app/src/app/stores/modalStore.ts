import { RootStore } from './rootStore';
import { observable, action } from 'mobx';

export default class ModalStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }
  @observable rr = false;

  @action render() {
    this.rr = !this.rr;
  }

  @observable.shallow modal = {
    open: false,
    body: null,
  };

  @action openModal = (content: any) => {
    this.modal.open = true;
    this.modal.body = content;
    this.rr = !this.rr;
  };

  @action closeModal = () => {
    this.modal.open = false;
    this.modal.body = null;
    this.rr = !this.rr;
  };
}
