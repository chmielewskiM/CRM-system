import { observable, action, computed, configure, runInAction } from 'mobx';
import { toast } from 'react-toastify';
import { IContact, ContactFormValues } from '../models/contact';
import agent from '../api/agent';
import { RootStore } from './rootStore';
import { Popup } from 'semantic-ui-react';

// configure({ enforceActions: 'always' });

export default class homeStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable body: string = '';

  @observable bool = false;

  @observable leadChart: boolean = false;

  @observable opportunityChart = false;

  @observable rr = false;

  @observable selectedEvent: Object | undefined;

  @action render() {
    this.rr = !this.rr;
    console.log('RR');
  }

  @action showLeadChart = () => {
    this.leadChart = !this.leadChart;
    console.log(this.leadChart);
    this.render();
  };

  @action showOpportunityChart = () => {
    this.opportunityChart = !this.opportunityChart;
    this.render();
  };

  @action sel = (ev: string, e: React.SyntheticEvent) => {
    var a = this.sel.bind;
    console.log(a);
    this.selectedEvent = ev;
    var b = ev;
    this.bool = !this.bool;
    this.body = ev;
    console.log(b);
    this.render();
  };
}
