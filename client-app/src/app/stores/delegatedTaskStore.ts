import {
  observable,
  action,
  computed,
  configure,
  runInAction,
  reaction,
} from 'mobx';
import { toast } from 'react-toastify';
import {
  IDelegatedTask,
  DelegatedTaskFormValues,
  ICompleteTaskData,
} from '../models/delegatedTask';
import agent from '../api/agent';
import { RootStore } from './rootStore';
import { IUser, User, IUserFormValues } from '../models/user';
import { combineDateAndTime } from '../common/util/util';
import { v4 as uuid } from 'uuid';

configure({ enforceActions: 'always' });

export default class DelegatedTaskStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    reaction(
      () => this.showDelegatedTaskForm,
      () => {
        this.setTaskList('myTasks');
      }
    );
  }

  @observable delegatedTasks: IDelegatedTask[] = [];

  @observable users: IUser[] = [];

  @observable selectedTask: IDelegatedTask | undefined;

  @observable loadingInitial = false;

  @observable showDelegatedTaskForm = false;

  @observable showShareTaskForm = false;

  @observable width = window.outerWidth;

  @observable submitting = false;

  @observable activeTaskRegistry = new Map();
  @observable pendingTaskRegistry = new Map();
  @observable.struct windowDimensions = {
    width: window.innerWidth,
  };
  @observable selectedValue = '';

  @observable usersRegistry = new Map();

  @observable rr = false;

  @observable displayDimmer: boolean = false;

  // controls
  @observable myTasks: boolean = true;
  @observable acceptedTasks: boolean = false;
  @observable refusedTasks: boolean = false;
  @observable pendingTasks: boolean = false;
  @observable doneTasks: boolean = false;
  @observable pendingTasksCount: number = 0;
  @observable pendingTasksNotifier: boolean = false;
  @observable formDateValidation = new Date();

  @action render() {
    this.rr = !this.rr;
  }
  ////
  //Computeds
  ////
  @computed get axiosParams() {
    const params = new URLSearchParams();
    params.append('myTasks', `${this.myTasks}`);
    params.append('accepted', `${this.acceptedTasks}`);
    params.append('refused', `${this.refusedTasks}`);
    params.append('pending', `${this.pendingTasks}`);
    params.append('done', `${this.doneTasks}`);
    return params;
  }
  @computed get activeTasksByDate() {
    let list = Array.from(this.activeTaskRegistry.values());
    return list;
  }
  @computed get pendingTasksByDate() {
    let list: IDelegatedTask[] = Array.from(this.pendingTaskRegistry.values());
    return list;
  }

  @computed get calendarEvents() {
    let tasks = this.activeTasksByDate;
    let events: {
      start: Date;
      deadline: Date;
      title: string;
      allDay: boolean;
      createdBy: string;
      pending: boolean;
      notes: string;
    }[] = [];

    tasks.forEach((task: IDelegatedTask, index) => {
      events[index] = {
        start: new Date(task.dateStarted),
        deadline: new Date(task.deadline),
        title: task.type,
        allDay: false,
        createdBy: task.access.createdBy,
        notes: task.notes,
        pending: task.pending,
      };
    });
    return events;
  }

  @action displayPendingTaskNotifier = () => {
    this.pendingTasksNotifier = !this.pendingTasksNotifier;
    this.render();
  };

  @action setTaskList = async (value: string, ev?: HTMLElement) => {
    if (ev?.parentElement) {
      for (var child of ev?.parentElement!.children)
        child.classList.remove('active');
      ev?.classList.add('active');
    }
    switch (value) {
      case 'myTasks':
        this.myTasks = true;
        this.acceptedTasks = false;
        this.refusedTasks = false;
        this.pendingTasks = false;
        this.doneTasks = false;
        break;
      case 'allSharedTasks':
        this.myTasks = false;
        this.acceptedTasks = false;
        this.refusedTasks = false;
        this.pendingTasks = false;
        this.doneTasks = false;
        break;
      case 'acceptedTasks':
        this.myTasks = false;
        this.acceptedTasks = true;
        this.refusedTasks = false;
        this.pendingTasks = false;
        this.doneTasks = false;
        break;
      case 'refusedTasks':
        this.myTasks = false;
        this.acceptedTasks = false;
        this.refusedTasks = true;
        this.pendingTasks = false;
        this.doneTasks = false;
        break;
      case 'pendingTasks':
        this.acceptedTasks = false;
        this.refusedTasks = false;
        this.pendingTasks = true;
        this.doneTasks = false;
        break;
      case 'doneTasks':
        this.myTasks = false;
        this.acceptedTasks = false;
        this.refusedTasks = false;
        this.pendingTasks = false;
        this.doneTasks = true;
        break;
    }
    this.loadTasks();
  };

  @action loadTasks = async () => {
    this.loadingInitial = true;
    try {
      const completeData = await agent.DelegatedTasks.list(this.axiosParams);
      runInAction('Loading Tasks', () => {
        this.width = window.innerWidth;
        this.pendingTasksCount = completeData.pendingTasksCount;
        if (this.pendingTasks) {
          let i = 0;
          this.pendingTaskRegistry.clear();
          completeData.tasks.forEach((task) => {
            this.pendingTaskRegistry.set(task.id, task);
            if (task.pending) i++;
          });
          this.pendingTasksCount = i;
        } else {
          this.activeTaskRegistry.clear();
          completeData.tasks.forEach((task) => {
            this.activeTaskRegistry.set(task.id, task);
          });
        }
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

  @action selectTask = (id: string) => {
    if (id !== '' && this.activeTaskRegistry.has(id))
      this.selectedTask = this.activeTaskRegistry.get(id);
    else if (id !== '' && this.pendingTaskRegistry.has(id))
      this.selectedTask = this.pendingTaskRegistry.get(id);
    else this.selectedTask = undefined;
    this.render();
  };

  @action addDelegatedTaskForm = () => {
    this.loadingInitial = true;
    this.selectedTask = undefined;
    this.selectedValue = '';
    this.showDelegatedTaskForm = true;
    this.loadingInitial = false;
    this.submitting = false;
    this.render();
  };

  @action editTaskForm = (id: string) => {
    this.loadingInitial = true;
    this.selectedTask = this.activeTaskRegistry.get(id);
    this.showDelegatedTaskForm = true;
    this.loadingInitial = false;
    this.render();
  };

  @action setShowDelegatedTaskForm = (show: boolean) => {
    this.showDelegatedTaskForm = show;
    this.render();
  };
  @action setShowShareTaskForm = (show: boolean, task?: IDelegatedTask) => {
    this.selectedTask = task;
    this.showShareTaskForm = show;
    this.render();
  };

  @action fillForm = () => {
    this.loadingInitial = true;
    if (this.selectedTask) {
      var selected = this.selectedTask;
      var task = new DelegatedTaskFormValues(selected);
      task.date = new Date(selected.deadline);
      task.time = new Date(selected.deadline);
      this.loadingInitial = false;
      return task;
    }
    this.loadingInitial = false;
    return new DelegatedTaskFormValues();
  };

  handleFinalFormSubmit = (values: any) => {
    const deadline = combineDateAndTime(values.date, values.time);
    const { date, time, ...delegatedTask } = values;
    delegatedTask.deadline = deadline;
    runInAction('Loading delegatedTasks', () => {
      this.formDateValidation = deadline;
    });
    if (!delegatedTask.id) {
      let newTask = {
        ...delegatedTask,
        id: uuid(),
      };
      this.addDelegatedTask(newTask);
    } else {
      this.editTask(delegatedTask);
    }
  };

  @action addDelegatedTask = async (delegatedTask: IDelegatedTask) => {
    this.submitting = true;
    delegatedTask.finishedBy = this.rootStore.userStore.user!.displayName;
    try {
      await agent.DelegatedTasks.add(delegatedTask);
      runInAction('Loading delegatedTasks', () => {
        this.activeTaskRegistry.set(delegatedTask.id, delegatedTask);
        toast.success('DelegatedTask added');
        this.showDelegatedTaskForm = false;
        this.submitting = false;
      });
      this.render();
    } catch (error) {
      runInAction('Loading delegatedTasks', () => {
        this.submitting = false;
      });
      toast.error('Problem occured');
      console.log(error.response);
    }
  };

  @action editTask = async (delegatedTask: IDelegatedTask) => {
    this.submitting = true;
    if (this.selectedTask) {
      try {
        await agent.DelegatedTasks.update(delegatedTask);
        runInAction('Loading delegatedTasks', () => {
          this.activeTaskRegistry.set(delegatedTask.id, delegatedTask);
          this.showDelegatedTaskForm = false;
          this.submitting = false;
          this.selectedTask = undefined;
        });
      } catch (error) {
        toast.error('Problem occured');
        console.log(error);
      }

      this.render();
    } else {
      this.showDelegatedTaskForm = false;
      this.submitting = false;
    }
  };

  @action deleteTask = async (id: string) => {
    this.submitting = true;
    try {
      await agent.DelegatedTasks.delete(id);
      runInAction('Loading delegatedTasks', () => {
        this.activeTaskRegistry.delete(this.selectedTask!.id);
        this.selectedTask = undefined;
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

  @action shareTask = async (taskId: string, user: IUserFormValues) => {
    this.submitting = true;
    await agent.DelegatedTasks.share(taskId, user);
    toast.success(
      'Shared ' + this.selectedTask?.type + ' with ' + user.username
    );
    try {
      runInAction('Loading delegatedTasks', () => {
        this.selectedTask = undefined;
        this.showShareTaskForm = false;
        this.submitting = false;
      });
    } catch (error) {
      console.log(error);
    }
    this.setTaskList('myTasks');
  };

  @action acceptTask = async (task: IDelegatedTask) => {
    this.submitting = true;
    try {
      await agent.DelegatedTasks.accept(task);
      runInAction('Accepting task', () => {
        this.submitting = false;
      });
    } catch (error) {
      console.log(error);
    }
    toast.success(`Accepted task from ${task.access.createdBy}`);
    this.setTaskList('myTasks');
  };
  @action refuseTask = async (task: IDelegatedTask) => {
    this.submitting = true;
    try {
      await agent.DelegatedTasks.refuse(task);
      runInAction('Refusing task', () => {
        this.submitting = false;
      });
    } catch (error) {
      console.log(error);
    }
    toast.success(`Refused task from ${task.access.createdBy}`);
    this.setTaskList('myTasks');
  };
  @action finishTask = async (task: IDelegatedTask) => {
    this.submitting = true;
    try {
      await agent.DelegatedTasks.finish(task);
      runInAction('Closing task', () => {
        this.submitting = false;
      });
    } catch (error) {
      console.log(error);
    }
    toast.success(`Finished task`);
    this.setTaskList('myTasks');
  };
}
