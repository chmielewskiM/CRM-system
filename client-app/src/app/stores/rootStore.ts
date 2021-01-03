import ContactStore from './contactStore';
import LeadStore from './leadStore';
import DelegatedTaskStore from './delegatedTaskStore';
import OrderStore from './orderStore';
import StockStore from './stockStore';
import CommonStore from './commonStore';
import UserStore from './userStore';
import { createContext } from 'react';
import { configure } from 'mobx';
import ModalStore from './modalStore';

configure({ enforceActions: 'always' });

export class RootStore {
  contactStore: ContactStore;
  leadStore: LeadStore;
  delegatedTaskStore: DelegatedTaskStore;
  orderStore: OrderStore;
  stockStore: StockStore;
  commonStore: CommonStore;
  modalStore: ModalStore;
  userStore: UserStore;

  constructor() {
    this.contactStore = new ContactStore(this);
    this.leadStore = new LeadStore(this);
    this.delegatedTaskStore = new DelegatedTaskStore(this);
    this.orderStore = new OrderStore(this);
    this.stockStore = new StockStore(this);
    this.commonStore = new CommonStore(this);
    this.modalStore = new ModalStore(this);
    this.userStore = new UserStore(this);
  }
}

export const RootStoreContext = createContext(new RootStore());
