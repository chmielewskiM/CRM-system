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
  @observable toggleIcon = 'bars';
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
    this.toggledNav ? (this.toggleIcon = 'bars') : (this.toggleIcon = 'bars off');
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
  
}
