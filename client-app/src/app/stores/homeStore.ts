import {
  observable,
  action,
  computed,
  configure,
  runInAction,
  reaction,
} from 'mobx';
import { toast } from 'react-toastify';
import { IContact, ContactFormValues } from '../models/contact';
import agent from '../api/agent';
import { RootStore } from './rootStore';
import { format } from 'date-fns';
import {
  ICollectedOperationData,
  ITotals,
  CompleteStats,
  ICompleteStats,
  IOperation,
  IOpportunitiesByUser,
} from '../models/operation';
import { destructureDate } from '../common/util/util';

// configure({ enforceActions: 'always' });

export default class homeStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    // this.loadOperations();
    reaction(
      () => this.predicate.keys(),
      () => {
        // this.loadOperations();
      }
    );
  }

  //Observables
  @observable loadingInitial = false;

  @observable.shallow operationsRegistry = new Map();

  @observable.shallow operationsTotalRegistry = new Map();

  @observable.shallow operationsByUserRegistry = new Map();

  @observable predicate = new Map();

  @observable body: string = '';

  @observable bool = false;

  @observable dataFetched = false;

  @observable pipelineTimeRange = true;

  @observable leadsChart = false;

  @observable leadsChartTimeRange = true;

  @observable opportunitiesChart = false;

  @observable opportunitiesChartTimeRange = true;

  @observable composedChartTimeRange = false;

  @observable rr = false;

  @observable selectedEvent: Object | undefined;

  @observable stats: ICompleteStats = new CompleteStats();
  //-Pipeline

  //--------------------------------------------
  //Computed
  @computed get axiosParams() {
    const params = new URLSearchParams();
    params.append('data', String(Boolean));
    // data.append('')
    return params;
  }

  @computed.struct get pipelineData() {
    let chartProps: Array<{
      name: string;
      value: number;
      percentage: string;
    }> = [];
    let range;
    let result = '';

    if (this.dataFetched) {
      if (this.pipelineTimeRange == false) range = 'sixMonths';
      else range = 'oneMonth';

      let operations: ITotals = this.operationsTotalRegistry.get(range);

      function countPercent(value: number) {
        if (operations.leadsTotal > 0) {
          result = `${((value / operations.leadsTotal) * 100).toFixed(1)}%`;
        } else return '0%';
        return result;
      }

      chartProps.push(
        {
          name: 'Leads',
          value: operations.leadsTotal,
          percentage: countPercent(operations.leadsTotal),
        },
        {
          name: 'Opportunities',
          value: operations.opportunitiesTotal,
          percentage: countPercent(operations.opportunitiesTotal),
        },
        {
          name: 'Quotes',
          value: operations.quotesTotal,
          percentage: countPercent(operations.quotesTotal),
        },
        {
          name: 'Invoices',
          value: operations.invoicesTotal,
          percentage: countPercent(operations.invoicesTotal),
        },
        {
          name: 'Conversions',
          value: operations.conversionsTotal,
          percentage: countPercent(operations.conversionsTotal),
        }
      );
    }
    return chartProps;
  }

  @computed.struct get thisMonthStats() {
    let chartProps: {
      leads?: number;
      conversions?: number;
      revenue?: number;
      orders?: number;
    } = {};

    if (this.dataFetched) {
      let operations: ITotals = this.operationsTotalRegistry.get('thisMonth');
      chartProps = {
        leads: operations.leadsTotal,
        conversions: operations.conversionsTotal,
        revenue: operations.revenueTotal,
        orders: operations.ordersTotal,
      };
    }
    
    return chartProps;
  }

  @computed.struct get leadsChartData() {
    if (!this.leadsChart && this.dataFetched) {
      return this.leadsBySourceData;
    } else if (this.dataFetched) return this.leadsOverallData;
    else return [];
  }

  @computed.struct get leadsOverallData() {
    let chartProps: Array<{ name: Date; value: number }> = [];
    let range;

    if (this.leadsChartTimeRange == false) range = 'sixMonths';
    else range = 'oneMonth';

    if (this.dataFetched) {
      let { ...data }: ICollectedOperationData[] = Array.from(
        this.operationsRegistry.get(range)
      );
      let operations = Object.values(data);
      operations.forEach((x) => {
        let obj: { name: Date; value: number } = { name: new Date(), value: 0 };
        obj.name = new Date(x.dateStart);
        obj.value = x.leads;
        chartProps.push(obj);
      });
    }
    return chartProps;
  }

  @computed.struct get leadsBySourceData() {
    let chartProps: Array<{ name: string; value: number }> = [];
    let range;

    if (this.leadsChartTimeRange == false) range = 'sixMonths';
    else range = 'oneMonth';

    if (this.dataFetched) {
      let operations: ITotals = this.operationsTotalRegistry.get(range);
      
      chartProps.push(
        { name: 'Web', value: operations.sourcesTotal.web },
        { name: 'Flyers', value: operations.sourcesTotal.flyers },
        { name: 'Commercial', value: operations.sourcesTotal.commercial },
        { name: 'Social Media', value: operations.sourcesTotal.socialMedia },
        { name: 'Former Client', value: operations.sourcesTotal.formerClient }
      );
    }
    return chartProps;
  }
  @computed.struct get opportunitiesChartData() {
    if (!this.opportunitiesChart && this.dataFetched) {
      return this.opportunitiesByEmployeeData;
    } else if (this.dataFetched) return this.opportunitiesOverallData;
    else return [];
  }
  @computed.struct get opportunitiesOverallData() {
    let chartProps: Array<{ name: Date; leads: number; opportunities: number }> = [];
    let range;

    if (this.opportunitiesChartTimeRange == false) range = 'sixMonths';
    else range = 'oneMonth';

    if (this.dataFetched) {
      let { ...data }: ICollectedOperationData[] = Array.from(
        this.operationsRegistry.get(range)
      );
      let operations = Object.values(data);

      operations.forEach((x) => {
        let obj: { name: Date; leads: number; opportunities: number } = {
          name: new Date(),
          leads: 0,
          opportunities: 0,
        };
        obj.name = x.dateEnd;
        obj.leads = x.leads;
        obj.opportunities = x.opportunities;
        chartProps.push(obj);
      });
    }
    return chartProps;
  }

  @computed.struct get opportunitiesByEmployeeData() {
    let chartProps: Array<{ name: string; leads: number; opportunities: number }> = [];
    let range;

    if (this.opportunitiesChartTimeRange == false) range = 'sixMonths';
    else range = 'oneMonth';

    if (this.dataFetched) {
      let { ...opportunities }: IOpportunitiesByUser[] = Array.from(
        this.operationsByUserRegistry.get(range)
      );
      let operations = Object.values(opportunities);

      operations.forEach((x) => {
        chartProps.push({
          name: x.userDisplayName,
          leads: x.leadsTotal,
          opportunities: x.opportunitiesTotal,
        });
      });
    }
    return chartProps;
  }
  //--------------------------------------------
  //Actions

  @action render() {
    this.rr = !this.rr;
  }
  @action setPredicate = (
    predicate: ICollectedOperationData,
    predicate2: ITotals,
    value1: string,
    value2: string
  ) => {
    this.predicate.clear();
    this.predicate.set(predicate, value1);
    this.predicate.set(predicate2, value2);
    this.predicate.get;
  };
  @action setTimeRange = (chart: string, range: boolean) => {
    runInAction('Loading error', () => {
      if (chart == 'leadsChart') this.leadsChartTimeRange = range;
      else if (chart == 'opportunitiesChart')
        this.opportunitiesChartTimeRange = range;
      else if (chart == 'composedChart') this.composedChartTimeRange = range;
      else if (chart == 'pipeline') this.pipelineTimeRange = range;

      this.loadingInitial = false;
      this.render();
    });
  };

  @action loadOperations = async () => {
    this.loadingInitial = true;
    this.dataFetched = false;
    try {
      const arr = [0, 1, 2, 3, 4, 5];
      let i = 0;
      const operations = await agent.Operations.list();
      const { ...data } = operations;
      const operationsByDate: Array<ICompleteStats> = Array.from(
        Object.values(data)
      );

      runInAction('Loading error', () => {
        this.operationsRegistry.clear();
        this.operationsTotalRegistry.clear();
        this.operationsByUserRegistry.clear();

        this.operationsTotalRegistry.set('thisMonth', operationsByDate[0]);
        this.operationsTotalRegistry.set('oneMonth', operationsByDate[1]);
        this.operationsTotalRegistry.set('sixMonths', operationsByDate[2]);

        this.operationsRegistry.set('thisMonth', operationsByDate[3]);
        this.operationsRegistry.set('oneMonth', operationsByDate[4]);
        this.operationsRegistry.set('sixMonths', operationsByDate[5]);

        this.operationsByUserRegistry.set('oneMonth', operationsByDate[6]);
        this.operationsByUserRegistry.set('sixMonths', operationsByDate[7]);

        this.dataFetched = true;
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

  @action showLeadsChart = () => {
    this.leadsChart = !this.leadsChart;
    this.render();
  };

  @action showOpportunitiesChart = () => {
    this.opportunitiesChart = !this.opportunitiesChart;
    this.render();
  };

  @action sel = (ev: string, e: React.SyntheticEvent) => {
    var a = this.sel.bind;
    this.selectedEvent = ev;
    var b = ev;
    this.bool = !this.bool;
    this.body = ev;
    this.render();
  };

  //Pipeline
}
