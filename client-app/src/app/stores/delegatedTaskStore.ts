import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext } from 'react';
import { toast } from 'react-toastify';
import {
  IDelegatedTask,
  DelegatedTaskFormValues,
} from '../models/delegatedTask';
import agent from '../api/agent';
import { isThisSecond } from 'date-fns';

configure({ enforceActions: 'always' });

class DelegatedTaskStore {
  @observable delegatedTasks: IDelegatedTask[] = [];

  @observable selectedDelegatedTask: IDelegatedTask | undefined;

  @observable loadingInitial = false;

  @observable showDelegatedTaskForm = false;

  @observable submitting = false;

  @observable delegatedTaskRegistry = new Map();

  @observable selectedValue = '';

  @observable render = false;

  @computed get delegatedTasksByDate() {
    return Array.from(this.delegatedTaskRegistry.values())
      .slice(0)
      .sort((a, b) => Date.parse(b.deadline) - Date.parse(a.deadline));
  }

  @action loadDelegatedTasks = async () => {
    this.loadingInitial = true;
    try {
      const delegatedTasks = await agent.DelegatedTasks.list();
      runInAction('Loading delegatedTasks', () => {
        delegatedTasks.forEach((delegatedTask) => {
          delegatedTask.deadline = new Date(delegatedTask.deadline!);
          this.delegatedTaskRegistry.set(delegatedTask.id, delegatedTask);
        });
        this.loadingInitial = false;
        this.render = true;
      });
    } catch (error) {
      runInAction('Loading error', () => {
        this.loadingInitial = false;
      });
      console.log(error);
    }
  };

  @action selectDelegatedTask = (id: string) => {
    this.render = !this.render;
    if (id !== '') {
      this.selectedDelegatedTask = this.delegatedTaskRegistry.get(id);
      this.selectedValue = this.selectedDelegatedTask!.type;
    } else {
      this.selectedDelegatedTask = undefined;
    }
  };

  @action addDelegatedTaskForm = () => {
    this.render = !this.render;
    this.selectedDelegatedTask = undefined;
    this.selectedValue = '';
    this.showDelegatedTaskForm = true;
    this.submitting = false;
  };

  @action editDelegatedTaskForm = (id: string) => {
    this.render = !this.render;
    this.selectedDelegatedTask = this.delegatedTaskRegistry.get(id);
    this.showDelegatedTaskForm = true;
  };

  @action setShowDelegatedTaskForm = (show: boolean) => {
    this.render = !this.render;
    this.showDelegatedTaskForm = show;
  };

  @action updateFormSelect = async (selection: string) => {
    this.selectedValue = selection;
    return this.selectedValue;
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
        this.render = !this.render;
        this.showDelegatedTaskForm = false;
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
          this.selectedDelegatedTask = delegatedTask;
          this.showDelegatedTaskForm = false;
          this.submitting = false;
          this.render = !this.render;
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
        this.render = !this.render;
      });
    } catch (error) {
      runInAction('Loading delegatedTasks', () => {
        this.submitting = false;
      });
      console.log(error);
    }
  };
}

export default createContext(new DelegatedTaskStore());
