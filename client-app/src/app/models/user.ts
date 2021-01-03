export interface IUser {
  id?:string;
  username: string;
  displayName: string;
  token: string;
  level: string;
}

export interface IUserFormValues {
  email?: string;
  password: string;
  displayName?: string;
  username: string;
}

export class UserFormValues implements IUserFormValues {
  email?: string;
  password: string = '';
  displayName?: string;
  username: string = '';

  constructor(init?: IUserFormValues) {
    Object.assign(this, init);
  }
}
