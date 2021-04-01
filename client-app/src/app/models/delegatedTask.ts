import { IUser, User } from './user';
export interface IUserAccess {
  createdByUsername: string;
  createdBy: string;
  sharedWithUsername: string;
  sharedWith: string;
}
export class UserAccessValues {
  createdByUsername: string = '';
  createdBy: string = '';
  sharedWithUsername: string = '';
  sharedWith: string = '';
}
export interface IDelegatedTask extends IUserAccess {
  id: string;
  type: string;
  deadline: Date;
  notes: string;
  dateStarted: Date;
  finishedBy: string;
  accepted: boolean;
  refused: boolean;
  pending: boolean;
  done: boolean;
  access: IUserAccess;
}

export interface IDelegatedTaskForm extends Partial<IDelegatedTask> {
  time?: Date;
}

export class DelegatedTaskFormValues implements IDelegatedTaskForm {
  id?: string = undefined;
  type: string = '';
  date?: Date = undefined;
  time?: Date = undefined;
  notes: string = '';
  dateStarted: Date = new Date();
  deadline: Date = new Date();
  finishedBy: string = '';
  accepted: boolean = false;
  refused: boolean = false;
  pending: boolean = false;
  done: boolean = false;
  access: IUserAccess = new UserAccessValues();

  constructor(init?: IDelegatedTaskForm) {
    if (init && init.deadline) {
      init.time = init.deadline;
    }
    Object.assign(this, init);
  }
}

export interface ICompleteTaskData extends IDelegatedTask {
  tasks: IDelegatedTask[];
  tasksCount: number;
}
