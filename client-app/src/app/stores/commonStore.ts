import { RootStore } from './rootStore';
import { observable, action, reaction } from 'mobx';
import { SyntheticEvent } from 'react';
import { OperationValues } from '../models/operation';

export default class CommonStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.token,
      (token) => {
        if (token) {
          window.localStorage.setItem('jwt', token);
        } else {
          window.localStorage.removeItem('jwt');
        }
      }
    );
  }

  @observable token: string | null = window.localStorage.getItem('jwt');
  @observable rowButtons?: Element;
  @observable appLoaded = false;
  @observable row?: Element;
  @observable toggleIcon = 'toggle on';
  @observable toggledNav = true;
  @observable expandedMenu = false;
  @observable rr = false;

  @action render() {
    this.rr = !this.rr;
  }
  @action setToken = (token: string | null) => {
    window.localStorage.setItem('jwt', token!);
    this.token = token;
  };

  @action setAppLoaded = () => {
    this.appLoaded = true;
  };

  @action toggleNav = () => {
    this.toggledNav = !this.toggledNav;
    this.toggledNav ? (this.toggleIcon = 'toggle on') : (this.toggleIcon = 'toggle off');
    this.rootStore.contactStore.render();
  };
  @action closeMobileNav = () => {
    if (window.innerWidth < 768) this.toggleNav();
    this.render();
  };
  @action expandMenu = (event: SyntheticEvent) => {
    let icon = event.target as HTMLElement;

    if (!this.expandedMenu) icon.parentElement?.parentElement?.classList.add('expanded');
    else icon.parentElement?.parentElement?.classList.remove('expanded');

    this.expandedMenu = !this.expandedMenu;
    this.render();
  };
  newStatistic = (stat: string) => {
    switch (stat) {
      case 'lead': {
        let operation = new OperationValues();
        operation.lead++;
        return operation;
      }
      case 'opportunity': {
        let operation = new OperationValues();
        operation.opportunity++;
        return operation;
      }
      case 'converted': {
        let operation = new OperationValues();
        operation.conversion++;
        return operation;
      }
      case 'order': {
        let operation = new OperationValues();
        operation.order++;
        return operation;
      }
      case 'revenue': {
        let operation = new OperationValues();
        operation.revenue++;
        return operation;
      }
      case 'source': {
        let operation = new OperationValues();
        // operation.source = value!;
        return operation;
      }
    }
  };
}
