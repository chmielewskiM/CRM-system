import { observable, action, computed, configure, runInAction } from 'mobx';
import { toast } from 'react-toastify';
import { IContact, ContactFormValues } from '../models/contact';
import agent from '../api/agent';
import { RootStore } from './rootStore';
import { format } from 'date-fns';

// configure({ enforceActions: 'always' });

export default class homeStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  //Observables
  @observable loadingInitial = false;

  @observable operationRegistry = new Map();

  @observable body: string = '';

  @observable bool = false;

  @observable leadChart: boolean = false;

  @observable opportunityChart = false;

  @observable rr = false;

  @observable selectedEvent: Object | undefined;
  //-Pipeline

  //--------------------------------------------
  //Computed
  @computed get operations() {
    let list = Array.from(this.operationRegistry.values());
    let data: {
      lead: number;
      opportunity: number;
      converted: number;
      order: number;
      revenue: number;
      source: string;
      date: number;
    }[];

    // const accepted = list.filter((x) => x.accepted == true);
    return 1;
  }
  @computed get dateRangeWeek() {
    let date = new Date();
    date.setDate(date.getDay() - 30)
    let data = [
      {name: format(new Date(date.setDate(date.getDay() - 30)), 'MM/dd/yyyy'), uv:200},
      {name: format(new Date(date.setDate(date.getDay() - 24)), 'MM/dd/yyyy'), uv:100},
      {name: format(new Date(date.setDate(date.getDay() - 18)), 'MM/dd/yyyy'), uv:150},
      {name: format(new Date(date.setDate(date.getDay() - 12)), 'MM/dd/yyyy'), uv:300},
      {name: format(new Date(date.setDate(date.getDay() - 6)), 'MM/dd/yyyy'), uv:200},
      {name: format(new Date(date.setDate(date.getDay())), 'MM/dd/yyyy'), uv:220},

    ]
    console.log(data)
    return data;
  }
  @computed get dateRangeMonth() {
    let date = new Date();
    return {
      x1: date.getDay() - 30,
      x2: date.getDay() - 24,
      x3: date.getDay() - 18,
      x4: date.getDay() - 12,
      x5: date.getDay() - 6,
      x6: date.getDay(),
    };
  }
  @computed get dateRangeYear() {
    let date = new Date();
    return {
      x1: date.getDay() - 30,
      x2: date.getDay() - 24,
      x3: date.getDay() - 18,
      x4: date.getDay() - 12,
      x5: date.getDay() - 6,
      x6: date.getDay(),
    };
  }
  @computed get countStats() {
    let list = Array.from(this.operationRegistry.values());
    let stats;
    let revenue = 0;
    let leads = list.filter((x) => x.lead > 0);
    let opportunities = list.filter((x) => x.opportunity > 0);
    let conversions = list.filter((x) => x.conversions > 0);
    let orders = list.filter((x) => x.order > 0);
    list
      .filter((element) => element.revenue > 0)
      .map((element) => {
        revenue += element.revenue;
      });

    return (stats = {
      leads: leads.length,
      opportunities: opportunities.length,
      conversions: conversions.length,
      orders: orders.length,
      revenue: revenue,
    });
  }
  // accumulateStat(records:any[], stat:string) {
  //   let accumulatedStat:any[];
  //   this.records.forEach((record)=>{
  //     if(record.stat)
  //     accumulatedStat.push(record)
  //     console.log(record.stat)
  //     // array.push(record)
  //   })

  //   };

  //--------------------------------------------
  //Actions

  @action render() {
    this.rr = !this.rr;
    console.log('RR');
  }

  @action loadOperations = async () => {
    this.loadingInitial = true;
    try {
      const operations = await agent.Operations.list();
      runInAction('Loading Orders', () => {
        operations.forEach((operation) => {
          this.operationRegistry.set(operation.id, operation);
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

  @action showLeadChart = () => {
    this.leadChart = !this.leadChart;
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

  //Pipeline
}
