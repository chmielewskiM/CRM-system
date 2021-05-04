import { RootStore } from './rootStore';
import {
  observable,
  action,
  reaction,
  makeObservable,
  runInAction,
} from 'mobx';
import { SyntheticEvent } from 'react';
import { OperationValues } from '../models/operation';
import { toast } from 'react-toastify';

export default class CommonStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    makeObservable(this, {
      token: observable,
      rowButtons: observable,
      appLoaded: observable,
      row: observable,
      toggleIcon: observable,
      toggledNav: observable,
      expandedMenu: observable,
      setToken: action,
      setAppLoaded: action,
      toggleNav: action,
      closeMobileNav: action,
      expandMenu: action,
    });

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

  token: string | null = window.localStorage.getItem('jwt');
  rowButtons?: Element;
  appLoaded = false;
  row?: Element;
  toggleIcon = 'bars';
  toggledNav = true;
  expandedMenu = false;

  setToken = (token: string | null) => {
    window.localStorage.setItem('jwt', token!);
    runInAction(() => {
      this.token = token;
    });
  };

  setAppLoaded = () => {
    runInAction(() => {
      this.appLoaded = true;
    });
  };

  toggleNav = () => {
    runInAction(() => {
      this.toggledNav = !this.toggledNav;
      this.toggledNav
        ? (this.toggleIcon = 'bars')
        : (this.toggleIcon = 'bars off');
    });
  };

  closeMobileNav = () => {
    if (window.innerWidth < 769) this.toggleNav();
  };

  expandMenu = (event: SyntheticEvent) => {
    let icon = event.target as HTMLElement;

    if (!this.expandedMenu)
      icon.parentElement?.parentElement?.classList.add('expanded');
    else icon.parentElement?.parentElement?.classList.remove('expanded');
    runInAction(() => {
      this.expandedMenu = !this.expandedMenu;
    });
  };

  handleErrorMessage(error: any) {
    console.log(error);

    if (error.status == 400 && !error.data.errors && error.data)
      return error.data;
    else if (error.status == 400 && error.data.errors.message[0])
      return error.data.errors.message[0];
    else if (error.data.errors.message) return error.data.errors.message;
  }
}
