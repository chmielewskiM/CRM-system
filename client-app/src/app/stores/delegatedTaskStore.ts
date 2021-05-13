import {
  observable,
  action,
  computed,
  configure,
  runInAction,
  reaction,
  makeObservable,
  autorun,
} from 'mobx';
import { toast } from 'react-toastify';
import {
  IDelegatedTask,
  DelegatedTaskFormValues,
} from '../models/delegatedTask';
import agent from '../api/agent';
import { RootStore } from './rootStore';
import { IUser, IUserFormValues } from '../models/user';
import { combineDateAndTime } from '../common/util/util';
import { v4 as uuid } from 'uuid';

configure({ enforceActions: 'always' });

const PAGE_SIZE = 10;
const PENDING_PAGE_SIZE = 5;

export default class DelegatedTaskStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    makeObservable(this, {
      activePage: observable,
      users: observable,
      selectedTask: observable,
      loadingInitial: observable,
      showTaskForm: observable,
      showShareTaskForm: observable,
      submitting: observable,
      activeTaskRegistry: observable,
      pendingTaskRegistry: observable,
      myTasks: observable,
      sharedTasks: observable,
      acceptedTasks: observable,
      refusedTasks: observable,
      doneTasks: observable,
      tasksCount: observable,
      pendingTasksCount: observable,
      pendingTasksNotifier: observable,
      formDateValidation: observable,
      axiosParams: computed,
      activeTasksByDate: computed,
      pendingTasksByDate: computed,
      calendarEvents: computed,
      loadingData: action,
      displayPendingTaskNotifier: action,
      setShowTaskForm: action,
      setShowShareTaskForm: action,
      setPagination: action,
    });
    this.rootStore = rootStore;


    reaction(
      () => this.axiosParams,
      () => {
        this.loadTasks();
      }
    );
    // autorun(

    // );
  }

  /////////////////////////////////////
  // collections
  delegatedTasks: IDelegatedTask[] = [];
  users: IUser[] = [];
  activeTaskRegistry = new Map();
  pendingTaskRegistry = new Map();
  usersRegistry = new Map();
  // forms and modals
  formDateValidation = new Date();
  selectedValue = '';
  showTaskForm = false;
  showShareTaskForm = false;
  // controls
  loadingInitial = false;
  submitting = false;
  selectedTask: IDelegatedTask | undefined;
  displayDimmer: boolean = false;
  pendingTasksCount: number = 0;
  pendingTasksNotifier: boolean = false;
  // pagination
  activePage = 0;
  pendingActivePage = 0;
  tasksCount = 0;
  // list parameters
  myTasks: boolean = true;
  sharedTasks: boolean = false;
  acceptedTasks: boolean = false;
  refusedTasks: boolean = false;
  pendingTasks: boolean = false;
  doneTasks: boolean = false;
  /////////////////////////////////////

  ////
  // *Computeds*
  //
  get axiosParams() {
    const params = new URLSearchParams();
    params.append('myTasks', `${this.myTasks}`);
    params.append('sharedTasks', `${this.sharedTasks}`);
    params.append('accepted', `${this.acceptedTasks}`);
    params.append('refused', `${this.refusedTasks}`);
    params.append('done', `${this.doneTasks}`);
    params.append('activePage', `${this.activePage}`);
    params.append('pageSize', `${PAGE_SIZE}`);
    return params;
  }

  get activeTasksByDate() {
    let list = Array.from(this.activeTaskRegistry.values());
    return list;
  }

  get pendingTasksByDate() {
    let list: IDelegatedTask[] = Array.from(this.pendingTaskRegistry.values());
    return list;
  }

  get calendarEvents() {
    let tasks = Array.from(this.activeTaskRegistry.values());
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
  //----------------------------------------

  ////
  // *Actions*
  //
  displayPendingTaskNotifier = () => {
    runInAction(() => {
      this.pendingTasksNotifier = !this.pendingTasksNotifier;
    });
  };

  setTaskList = async (value: string, ev?: HTMLElement) => {
    this.selectTask('');
    runInAction(() => {
      if (ev?.parentElement) {
        for (var child of ev?.parentElement!.children)
          child.classList.remove('active');
        ev?.classList.add('active');
      }

      if (
        value === 'myTasks' ||
        value === 'sharedByUser' ||
        value === 'sharedWithUser' ||
        value === 'all'
      ) {
        //reset sub categories when main category changes
        let allBtn = document.getElementsByClassName('all-btn').item(0);

        if (allBtn) {
          for (var child of allBtn.parentElement!.children)
            child.classList.remove('active');
          allBtn?.classList.add('active');
        }
      }

      this.acceptedTasks = false;
      this.refusedTasks = false;
      this.doneTasks = false;
      if (value != 'pendingTasks') this.activePage = 0;

      switch (value) {
        case 'myTasks':
          this.myTasks = true;
          this.sharedTasks = false;
          break;
        case 'sharedByUser':
          this.myTasks = true;
          this.sharedTasks = true;
          break;
        case 'sharedWithUser':
          this.myTasks = false;
          this.sharedTasks = true;
          break;
        case 'acceptedTasks':
          this.acceptedTasks = true;
          break;
        case 'refusedTasks':
          this.refusedTasks = true;
          break;
        case 'pendingTasks':
          break;
        case 'doneTasks':
          this.doneTasks = true;
          break;
      }
    });
  };

  setPagination = async (modifier: number) => {
    runInAction(() => {
      this.activePage += modifier;
    });
  };

  loadingData = (value: boolean) => {
    runInAction(() => {
      this.loadingInitial = value;
    });
  };
  submittingData = (value: boolean) => {
    runInAction(() => {
      this.submitting = value;
    });
  };

  loadUsers = async () => {
    this.loadingData(true);
    try {
      const users = await agent.Users.listUsers();
      runInAction(() => {
        users.forEach((user) => {
          this.usersRegistry.set(user.id, user);
        });
      });
      this.loadingData(false);
    } catch (error) {
      this.loadingData(false);
      console.log(error);
    }
  };

  selectTask = (id: string) => {
    if (id !== '' && this.activeTaskRegistry.has(id))
      this.selectedTask = this.activeTaskRegistry.get(id);
    else if (id !== '' && this.pendingTaskRegistry.has(id))
      this.selectedTask = this.pendingTaskRegistry.get(id);
    else this.selectedTask = undefined;
  };
  //----------------------------------------

  // *Forms*
  addTaskForm = () => {
    this.loadingData(true);
    this.selectedTask = undefined;
    this.selectedValue = '';
    this.showTaskForm = true;
    this.loadingData(false);
    this.submittingData(false);
  };

  editTaskForm = (id: string) => {
    this.loadingData(true);
    this.selectedTask = this.activeTaskRegistry.get(id);
    this.showTaskForm = true;
    this.loadingData(false);
  };

  setShowTaskForm = (show: boolean) => {
    this.showTaskForm = show;
  };
  setShowShareTaskForm = (show: boolean, task?: IDelegatedTask) => {
    this.selectedTask = task;
    this.showShareTaskForm = show;
  };

  fillForm = () => {
    this.loadingData(true);
    if (this.selectedTask) {
      var selected = this.selectedTask;
      var task = new DelegatedTaskFormValues(selected);
      task.date = new Date(selected.deadline);
      task.time = new Date(selected.deadline);
      this.loadingData(false);
      return task;
    }
    this.loadingData(false);
    return new DelegatedTaskFormValues();
  };

  handleFinalFormSubmit = (values: any) => {
    const deadline = combineDateAndTime(values.date, values.time);
    const { date, time, ...delegatedTask } = values;
    delegatedTask.deadline = deadline;
    runInAction(() => {
      this.formDateValidation = deadline;
    });
    if (!delegatedTask.id) {
      let newTask = {
        ...delegatedTask,
        id: uuid(),
      };
      this.addTask(newTask);
    } else {
      this.editTask(delegatedTask);
    }
  };
  //----------------------------------------

  // *CRUD task actions*
  loadTasks = async () => {
    this.loadingData(true);
    try {
      const completeData = await agent.DelegatedTasks.listTasks(
        this.axiosParams
      );
      runInAction(() => {
        this.tasksCount = completeData.tasksCount;
        this.activeTaskRegistry.clear();
        completeData.tasks.forEach((task) => {
          this.activeTaskRegistry.set(task.id, task);
        });
      });
      this.loadingData(false);
    } catch (error) {
      this.loadingData(false);
      console.log(error);
    }
  };

  loadPendingTasks = async () => {
    this.loadingData(true);
    try {
      const completeData = await agent.DelegatedTasks.listPendingTasks(
        this.pendingActivePage,
        PENDING_PAGE_SIZE
      );
      runInAction(() => {
        this.pendingTasksCount = completeData.tasksCount;
        this.pendingTaskRegistry.clear();
        completeData.tasks.forEach((task) => {
          this.pendingTaskRegistry.set(task.id, task);
        });
      });
      this.loadingData(false);
    } catch (error) {
      this.loadingData(false);
      console.log(error);
    }
  };

  addTask = async (delegatedTask: IDelegatedTask) => {
    this.submittingData(true);
    delegatedTask.finishedBy = this.rootStore.userStore.user!.displayName;
    try {
      await agent.DelegatedTasks.addTask(delegatedTask);
      runInAction(() => {
        this.activeTaskRegistry.set(delegatedTask.id, delegatedTask);
        toast.success('DelegatedTask added');
        this.setShowTaskForm(false);
      });
      this.submittingData(false);
      await this.loadTasks();
    } catch (error) {
      this.submittingData(false);
      toast.error(this.rootStore.commonStore.handleErrorMessage(error));
    }
  };

  editTask = async (delegatedTask: IDelegatedTask) => {
    this.submittingData(true);
    if (this.selectedTask) {
      try {
        await agent.DelegatedTasks.updateTask(delegatedTask);
        runInAction(() => {
          this.activeTaskRegistry.set(delegatedTask.id, delegatedTask);
          this.setShowTaskForm(false);
          this.selectedTask = undefined;
        });
        this.submittingData(false);
      } catch (error) {
        this.setShowTaskForm(false);
        this.submittingData(false);
        toast.error(this.rootStore.commonStore.handleErrorMessage(error));
      }
    } else {
      this.setShowTaskForm(false);
      this.submittingData(false);
    }
  };

  deleteTask = async (id: string) => {
    this.submittingData(true);
    try {
      await agent.DelegatedTasks.deleteTask(id);
      runInAction(() => {
        this.activeTaskRegistry.delete(this.selectedTask!.id);
        this.selectedTask = undefined;
      });
      this.submittingData(false);
    } catch (error) {
      this.submittingData(false);
      console.log(error);
    }
  };

  acceptTask = async (task: IDelegatedTask) => {
    this.submittingData(true);
    try {
      await agent.DelegatedTasks.acceptTask(task);
      this.submittingData(false);
    } catch (error) {
      this.submittingData(false);
      console.log(error);
    }
    toast.success(`Accepted task from ${task.access.createdBy}`);
    await this.loadPendingTasks();
    await this.loadTasks();
  };

  refuseTask = async (task: IDelegatedTask) => {
    this.submittingData(true);
    try {
      await agent.DelegatedTasks.refuseTask(task);
      this.submittingData(false);
    } catch (error) {
      this.submittingData(false);
      console.log(error);
    }
    toast.success(`Refused task from ${task.access.createdBy}`);
    await this.loadPendingTasks().then(this.loadTasks);
  };

  finishTask = async (task: IDelegatedTask) => {
    this.submittingData(true);
    try {
      await agent.DelegatedTasks.finishTask(task);
      this.submittingData(false);
      this.selectTask('');
    } catch (error) {
      this.submittingData(false);
      console.log(error);
    }
    toast.success(`Finished task`);
    await this.loadTasks();
  };

  shareTask = async (taskId: string, user: IUserFormValues) => {
    this.submittingData(true);
    await agent.DelegatedTasks.shareTask(taskId, user);
    toast.success(
      'Shared ' + this.selectedTask?.type + ' with ' + user.username
    );
    try {
      runInAction(() => {
        this.selectedTask = undefined;
        this.showShareTaskForm = false;
      });
      this.submittingData(false);
    } catch (error) {
      this.submittingData(false);
      console.log(error);
    }
    await this.loadTasks();
  };
  //----------------------------------------
}
