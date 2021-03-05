import { observable, computed, action, runInAction, reaction } from 'mobx';
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
        this.render();
      }
    );
  }

  //Observables
  @observable fieldContent = '';

  @observable fields = document.getElementsByClassName('field');

  @observable user: IUser | null = null;

  @observable topAccess: boolean = false;
  @observable midAccess: boolean = false;
  @observable lowAccess: boolean = false;

  @observable checked: boolean = false;

  @observable userList = new Map();

  @observable selectedUser: IUserFormValues = new UserFormValues();

  @observable e: any = [];

  @observable rr = false;

  @observable c = document.getElementById('form');

  @observable inputValue = '';

  //Computeds
  @computed get isLoggedIn() {
    return !!this.user;
  }

  @computed get usersByName() {
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

  //Actions
  @action render() {
    this.rr = !this.rr;
  }

  @action getUserList = async () => {
    try {
      const us = await agent.Users.list();
      runInAction(() => {
        us.forEach((element) => {
          this.userList.set(element.id, element);
        });
        this.render();
      });
    } catch (error) {
      console.log(error);
    }
  };

  @action login = async (values: IUserFormValues) => {
    try {
      const user = await agent.Users.login(values);
      runInAction(() => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token);
      history.push('/dashboard');
    } catch (error) {
      toast.error('Invalid username or password. Try again.');
      this.rootStore.contactStore.render();
    }
  };

  @action register = async (values: IUserFormValues) => {
    try {
      const user = await agent.Users.register(values);
      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  @action getUser = async (username: string) => {
    if (username) {
      try {
        const users = await agent.Users.get(username);
        const users2 = new UserFormValues(users);
        runInAction(() => {
          this.selectedUser = users2;
          this.checked = true;
        });
        this.render();
      } catch (error) {
        console.log(error);
      }
    }
  };

  @action getLoggedUser = async () => {
    try {
      const users = await agent.Users.logged();
      if (users) {
        const users2 = new User(users);
        runInAction(() => {
          this.user = users2;
          this.checked = true;
        });
      }
      this.render();
    } catch (error) {
      console.log(error);
    }
  };

  @action logout = () => {
    this.rootStore.commonStore.setToken(null);
    this.user = null;
    history.push('/');
  };
}
