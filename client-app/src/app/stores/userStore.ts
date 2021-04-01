import {
  observable,
  computed,
  action,
  runInAction,
  reaction,
  makeObservable,
  autorun,
} from 'mobx';
import { IUser, IUserFormValues, UserFormValues, User } from '../models/user';
import agent from '../api/agent';
import { RootStore } from './rootStore';
import { history } from '../..';
import { toast } from 'react-toastify';
import { toJS } from 'mobx';
import { Input } from 'semantic-ui-react';
import { isThisSecond } from 'date-fns';

export default class UserStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    makeObservable(this, {
      user: observable,
      topAccess: observable,
      midAccess: observable,
      lowAccess: observable,
      checked: observable,
      userList: observable,
      selectedUser: observable,
      isLoggedIn: computed,
      usersByName: computed,
      getUserList: action,
      login: action,
      register: action,
      getUser: action,
      getLoggedUser: action,
      logout: action,
    });

    this.rootStore = rootStore;
    reaction(
      () => this.isLoggedIn,
      async () => {
        const user = await agent.Users.logged();
        runInAction(() => {
          this.topAccess = this.midAccess = this.lowAccess = false;
          this.user = user;
          if (user.level == 'top') this.topAccess = true;
          else if (user.level == 'mid') this.midAccess = true;
          else this.lowAccess = true;
        });
      }
    );
    autorun(() => this.getLoggedUser());
  }

  /////////////////////////////////////
  //collections
  userList = new Map();
  //instances
  selectedUser: IUserFormValues = new UserFormValues();
  user: IUser | null = null;
  //controls
  topAccess: boolean = false;
  midAccess: boolean = false;
  lowAccess: boolean = false;
  checked: boolean = false;
  //----------------------------------------------------

  ////
  // *Computeds*
  get isLoggedIn() {
    return !!this.user;
  }

  get usersByName() {
    let User;
    let Users: Array<Object> = [];
    let list = Array.from(this.userList.values());
    list.map((user, el) => {
      User = {
        key: user.id,
        text: user.userName,
        value: user.userName,
      };
      Users.push(User);
    });

    return Users;
  }
  //----------------------------------------------------

  ////
  // *Actions*
  getUserList = async (removeLoggedUser?: boolean) => {
    try {
      const us = await agent.Users.list();
      runInAction(() => {
        us.forEach((element) => {
          if (
            (!removeLoggedUser || element.id != this.user?.id) &&
            element.level != 'top'
          )
            this.userList.set(element.id, element);
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  login = async (values: IUserFormValues) => {
    try {
      const user = await agent.Users.login(values);
      runInAction(() => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token);
      history.push('/dashboard');
    } catch (error) {
      toast.error('Invalid username or password. Try again.');
    }
  };

  register = async (values: IUserFormValues) => {
    try {
      const user = await agent.Users.register(values);
      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  getUser = async (username: string) => {
    if (username !== 'none') {
      try {
        const users = await agent.Users.get(username);
        const users2 = new UserFormValues(users);
        runInAction(() => {
          this.selectedUser = users2;
          this.checked = true;
        });
      } catch (error) {
        console.log(error);
      }
    } else
      runInAction(() => {
        this.selectedUser = new UserFormValues();
      });
  };

  getLoggedUser = async () => {
    try {
      const users = await agent.Users.logged();
      if (users) {
        const users2 = new User(users);
        runInAction(() => {
          this.user = users2;
          this.checked = true;
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  logout = () => {
    this.rootStore.commonStore.setToken(null);
    runInAction(() => {
      this.user = null;
    });
    history.push('/');
  };
  //----------------------------------------------------
}
