export interface IDelegatedTask {
  id: string;
  assignment: string;
  type: string;
  deadline: Date;
  notes: string;
  done: boolean;
}

export interface IDelegatedTaskForm extends Partial<IDelegatedTask> {
  time?: Date;
}

export class DelegatedTaskFormValues implements IDelegatedTaskForm {
  id?: string = undefined;
  assignment: string = '';
  type: string = '';
  date?: Date = undefined;
  time?: Date = undefined;
  notes: string = '';
  done: boolean = false;

  constructor(init?: IDelegatedTaskForm) {
    if (init && init.deadline) {
      init.time = init.deadline;
    }
    Object.assign(this, init);
  }
}
