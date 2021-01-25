export interface IUser {
  id?:string;
  username: string;
  displayName: string;
  token: string;
  level: string;
  email?: string;
}

export interface IUserFormValues {
  email?: string;
  password: string;
  displayName?: string;
  username: string;
  level: string;
}

export class UserFormValues implements IUserFormValues {
  email?: string;
  password: string = '';
  displayName?: string;
  username: string = '';
  level: string = '';
  constructor(init?: IUserFormValues) {
    Object.assign(this, init);
  }
}
export class User implements IUser {
  id?:string;
  username: string ='';
  displayName: string ='';
  token: string ='';
  level: string ='';
  email?: string;
  constructor(init?: IUser) {
    Object.assign(this, init);
  }
}