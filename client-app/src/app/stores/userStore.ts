import { observable, computed, action, runInAction } from 'mobx';
import { IUser, IUserFormValues, UserFormValues, User } from '../models/user';
import agent from '../api/agent';
import { RootStore } from './rootStore';
import { history } from '../..';
import { toast } from 'react-toastify';
import { toJS } from 'mobx';
import { Input } from 'semantic-ui-react';

export default class UserStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }
  @observable fieldContent = '';
  @observable fields = document.getElementsByClassName('field');
  @observable user: IUser | null = null;
  @observable checked: boolean = false;
  @observable userList = new Map();
  @observable
  selectedUser: IUserFormValues = new UserFormValues();
  @computed get isLoggedIn() {
    return !!this.user;
  }
  @observable e: any = [];
  @observable rr = false;
  @observable c = document.getElementById('form');
  @observable inputValue = '';
  @action render() {
    this.rr = !this.rr;
  }
  @computed get usersByName() {
    let t;
    let e: Array<Object> = [];
    let a = Array.from(this.userList.values());
    a.map((user, el) => {
      t = {
        key: user.id,
        text: user.userName,
        value: user.userName,
      };
      e.push(t);
    });

    return e;
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
    } catch (error) {}
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
        console.log(this.selectedUser);
        this.render();
      } catch (error) {
        console.log(error);
      }
    }
  };

  @action logout = () => {
    this.rootStore.commonStore.setToken(null);
    this.user = null;
    history.push('/');
  };
}
