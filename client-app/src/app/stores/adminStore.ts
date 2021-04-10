import { RootStore } from './rootStore';
import { observable, makeObservable } from 'mobx';
import { User } from '../models/user';

export default class AdminStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    makeObservable(this, {
      level: observable,
    });
    this.rootStore = rootStore;
  }

  level: boolean = false;

  handleFinalFormSubmit = (values: any, level: boolean) => {
    const { ...data } = values;
    let user = new User(data);

    level ? (user.level = 'mid') : (user.level = 'low');

    if (user.id == '') this.rootStore.userStore.register(user);
    else this.rootStore.userStore.editUser(user);
  };
}
