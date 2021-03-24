import { RootStore } from './rootStore';
import { observable, action, reaction } from 'mobx';
import { IUserFormValues } from '../models/user';
import { v4 as uuid } from 'uuid';

export default class AdminStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  handleFinalFormSubmit = (values: IUserFormValues) =>{
    const { ...user } = values;
    if (!user.username) {
      let newUser = {
        ...user,
        id: uuid(),
      };
      this.rootStore.userStore.register(newUser);
    } else {
        // this.rootStore.userStore.register(user);
    }
  };

}
