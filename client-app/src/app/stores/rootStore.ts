import ContactStore from './contactStore';
import HomeStore from './homeStore';
import LeadStore from './leadStore';
import DelegatedTaskStore from './delegatedTaskStore';
import OrderStore from './orderStore';
import AdminStore from './adminStore';
import CommonStore from './commonStore';
import UserStore from './userStore';
import { createContext } from 'react';
import { configure } from 'mobx';
import ModalStore from './modalStore';
import React from 'react';

configure({ enforceActions: 'always' });

export class RootStore {
  homeStore: HomeStore;
  contactStore: ContactStore;
  leadStore: LeadStore;
  delegatedTaskStore: DelegatedTaskStore;
  orderStore: OrderStore;
  commonStore: CommonStore;
  modalStore: ModalStore;
  userStore: UserStore;
  adminStore: AdminStore;

  constructor() {
    this.homeStore = new HomeStore(this);
    this.contactStore = new ContactStore(this);
    this.leadStore = new LeadStore(this);
    this.delegatedTaskStore = new DelegatedTaskStore(this);
    this.orderStore = new OrderStore(this);
    this.commonStore = new CommonStore(this);
    this.modalStore = new ModalStore(this);
    this.userStore = new UserStore(this);
    this.adminStore = new AdminStore(this);
  }
}

const RootStoreContext = createContext(new RootStore());

export const useStores = () => React.useContext(RootStoreContext);
