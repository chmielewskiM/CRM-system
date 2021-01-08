import { observable, action, computed, configure, runInAction } from 'mobx';
import { toast } from 'react-toastify';
import { IDelegatedTask, DelegatedTaskFormValues } from '../models/delegatedTask';
import agent from '../api/agent';
import { RootStore } from './rootStore';
import { IUser } from '../models/user';

configure({ enforceActions: 'always' });

export default class DelegatedTaskStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable delegatedTasks: IDelegatedTask[] = [];

  @observable users: IUser[] = [];

  @observable selectedDelegatedTask: IDelegatedTask | undefined;

  @observable loadingInitial = false;

  @observable showDelegatedTaskForm = false;

  @observable submitting = false;

  @observable delegatedTaskRegistry = new Map();

  @observable selectedValue = '';

  @observable usersRegistry = new Map();

  @observable rr = false;

  @observable displayDimmer: boolean = false;

  @action render() {
    this.rr = !this.rr;
  }

  @computed get delegatedTasksByDate() {
    return Array.from(this.delegatedTaskRegistry.values())
      .slice(0)
      .sort((a, b) => Date.parse(b.deadline) - Date.parse(a.deadline));
  }

  @action loadDelegatedTasks = async () => {
    this.loadingInitial = true;
    try {
      const delegatedTasks = await agent.DelegatedTasks.list();
      runInAction('Loading Tasks', () => {
        delegatedTasks.forEach((delegatedTask) => {
          delegatedTask.deadline = new Date(delegatedTask.deadline!);
          this.delegatedTaskRegistry.set(delegatedTask.id, delegatedTask);
        });
        this.loadingInitial = false;
        this.render();
      });
    } catch (error) {
      runInAction('Loading error', () => {
        this.loadingInitial = false;
      });
      console.log(error);
    }
  };

  @computed get assignmentOptions() {
    const userOptions: Array<Object> = [];
    this.usersRegistry.forEach((user) => {
      let newName = {
        key: user.displayName,
        text: user.displayName,
        value: user.displayName,
      };
      userOptions.push(newName);
    });
    return userOptions;
  }

  @action loadUsers = async () => {
    this.loadingInitial = true;
    try {
      const users = await agent.Users.list();
      runInAction('Loading Tasks', () => {
        users.forEach((user) => {
          this.usersRegistry.set(user.id, user);
        });
        this.loadingInitial = false;

        this.render();
      });
    } catch (error) {
      runInAction('Loading error', () => {
        this.loadingInitial = false;
      });
      console.log(error);
    }
  };

  @action selectDelegatedTask = (id: string) => {
    if (id !== '') {
      this.selectedDelegatedTask = this.delegatedTaskRegistry.get(id);
      this.render();
    } else {
      this.selectedDelegatedTask = undefined;
      this.render();
    }
  };

  @action addDelegatedTaskForm = () => {
    this.selectedDelegatedTask = undefined;
    this.selectedValue = '';
    this.showDelegatedTaskForm = true;
    this.submitting = false;
    this.render();
  };

  @action editDelegatedTaskForm = (id: string) => {
    this.selectedDelegatedTask = this.delegatedTaskRegistry.get(id);
    this.showDelegatedTaskForm = true;
    this.render();
  };

  @action setShowDelegatedTaskForm = (show: boolean) => {
    this.showDelegatedTaskForm = show;
    this.render();
  };

  @action fillForm = () => {
    if (this.selectedDelegatedTask) {
      var selected = this.selectedDelegatedTask;
      var task = new DelegatedTaskFormValues(selected);
      task.date = selected.deadline;
      return task;
    }
    return new DelegatedTaskFormValues();
  };

  @action addDelegatedTask = async (delegatedTask: IDelegatedTask) => {
    this.submitting = true;
    try {
      await agent.DelegatedTasks.add(delegatedTask);
      runInAction('Loading delegatedTasks', () => {
        this.delegatedTaskRegistry.set(delegatedTask.id, delegatedTask);
        toast.success('DelegatedTask added');
        this.showDelegatedTaskForm = false;
        this.submitting = false;
        this.render();
      });
    } catch (error) {
      runInAction('Loading delegatedTasks', () => {
        this.submitting = false;
      });
      toast.error('Problem occured');
      console.log(error.response);
    }
  };

  @action editDelegatedTask = async (delegatedTask: IDelegatedTask) => {
    this.submitting = true;
    if (this.selectedDelegatedTask !== delegatedTask) {
      try {
        await agent.DelegatedTasks.update(delegatedTask);
        runInAction('Loading delegatedTasks', () => {
          this.delegatedTaskRegistry.set(delegatedTask.id, delegatedTask);
          this.showDelegatedTaskForm = false;
          this.submitting = false;
          this.render();
        });
      } catch (error) {
        runInAction('Loading delegatedTasks', () => {
          this.submitting = false;
        });
        toast.error('Problem occured');
        console.log(error);
      }
    } else {
      this.showDelegatedTaskForm = false;
      this.submitting = false;
    }
  };

  @action deleteDelegatedTask = async (id: string) => {
    this.submitting = true;
    try {
      await agent.DelegatedTasks.delete(id);
      runInAction('Loading delegatedTasks', () => {
        this.delegatedTaskRegistry.delete(this.selectedDelegatedTask!.id);
        this.selectedDelegatedTask = undefined;
        this.submitting = false;
        this.render();
      });
    } catch (error) {
      runInAction('Loading delegatedTasks', () => {
        this.submitting = false;
      });
      console.log(error);
    }
  };

  // Notifier and notifications
 
  @observable notes = 'lala'
  @action showDimmer = () => {
    this.displayDimmer = true;
    console.log(this.displayDimmer)
    this.render();
  }
  @action hideDimmer = () => {
    this.displayDimmer = false;
    console.log(this.displayDimmer)
    this.render();
  }
}
