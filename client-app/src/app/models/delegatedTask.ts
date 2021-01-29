export interface IDelegatedTask {
  id: string;
  type: string;
  deadline: Date;
  notes: string;
  dateStarted: Date;
  createdBy: string;
  done: boolean;
  accepted: boolean;
  refused: boolean;
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
  createdBy: string = '';
  done: boolean = false;
  accepted: boolean = false;
  refused: boolean = false;

  constructor(init?: IDelegatedTaskForm) {
    if (init && init.deadline) {
      init.time = init.deadline;
    }
    Object.assign(this, init);
  }
}
