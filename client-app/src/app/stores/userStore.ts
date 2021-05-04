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

export default class UserStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    makeObservable(this, {
      submitting: observable,
      user: observable,
      topAccess: observable,
      midAccess: observable,
      lowAccess: observable,
      logged: observable,
      userList: observable,
      selectedUser: observable,
      isLoggedIn: computed,
      usersByName: computed,
      submittingData: action,
      getUserList: action,
      login: action,
      register: action,
      getUser: action,
      getLoggedUser: action,
      logout: action,
    });

    this.rootStore = rootStore;
    reaction(
      () => this.user,
      () => {
        runInAction(() => {
          this.topAccess = this.midAccess = this.lowAccess = false;
          // this.user = user;
          if (this.user?.level == 'top') this.topAccess = true;
          else if (this.user?.level == 'mid') this.midAccess = true;
          else this.lowAccess = true;
        });
      }
    );
    autorun(() => {
      if (this.rootStore.commonStore.token) {
        this.getLoggedUser().then(() =>
          this.rootStore.commonStore.setAppLoaded()
        );
      } else {
        this.rootStore.commonStore.setAppLoaded();
      }
    });
    autorun(async () => {
      try {
        await this.getLoggedUser().then(async () => {
          await agent.Users.loggedUser();
        });
      } catch {}
    });
  }

  /////////////////////////////////////
  //collections
  userList = new Map();
  //instances
  selectedUser: IUserFormValues = new UserFormValues();
  user: IUser | null = null;
  //controls
  submitting: boolean = false;
  topAccess: boolean = false;
  midAccess: boolean = false;
  lowAccess: boolean = false;
  logged: boolean = false;
  //----------------------------------------------------

  ////
  // *Computeds*
  get isLoggedIn() {
    return !!this.logged;
  }

  get usersByName() {
    let User;
    let Users: Array<Object> = [];
    let list = Array.from(this.userList.values());
    list.map((user, el) => {
      User = {
        key: user.id,
        text: user.username,
        value: user.username,
      };
      Users.push(User);
    });

    return Users;
  }
  //----------------------------------------------------

  ////
  // *Actions*
  submittingData = (value: boolean) => {
    runInAction(() => {
      this.submitting = value;
    });
  };

  getUserList = async (removeLoggedUser?: boolean) => {
    try {
      const us = await agent.Users.listUsers();
      this.userList.clear();
      runInAction(() => {
        us.forEach((user) => {
          if (
            (!removeLoggedUser || user.id != this.user?.id) &&
            user.level != 'top'
          )
            this.userList.set(user.id, user);
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
      history.push('/dashboard/home');
    } catch (error) {
      console.log(error);
      toast.error('Invalid username or password. Try again.');
    }
  };

  register = async (values: IUserFormValues) => {
    this.submittingData(true);
    try {
      const user = await agent.Users.registerUser(values);
      this.submittingData(false);
      this.getUserList();
      toast.success('User added successfully');
    } catch (error) {
      this.submittingData(false);
      toast.error(this.rootStore.commonStore.handleErrorMessage(error));
    }
  };

  editUser = async (user: IUser) => {
    this.submittingData(true);
    if (this.selectedUser) {
      try {
        await agent.Users.updateUser(user);
        runInAction(() => {
          this.userList.set(user.id, user);
        });
        this.getUserList();
        this.submittingData(false);
        toast.success('Changes saved successfully.');
      } catch (error) {
        this.submittingData(false);
        toast.error(this.rootStore.commonStore.handleErrorMessage(error));
      }
    } else {
      toast.info('No changes');
      this.submittingData(false);
    }
  };

  deleteUser = async () => {
    this.submittingData(true);
    try {
      await agent.Users.deleteUser(this.selectedUser.username);
      this.getUserList();
      this.submittingData(false);
      toast.success('User deleted successfully.');
    } catch (error) {
      this.submittingData(false);
      toast.error(error.data.errors.message);
      console.log(error);
    }
  };

  getUser = async (username: string) => {
    if (username !== 'none') {
      try {
        console.log(username);
        const users = await agent.Users.getUser(username);
        const users2 = new UserFormValues(users);
        runInAction(() => {
          this.selectedUser = users2;
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
      const users = await agent.Users.loggedUser();
      if (users) {
        const users2 = new User(users);
        runInAction(() => {
          this.user = users2;
          this.logged = true;
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
