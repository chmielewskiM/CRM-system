import {
  observable,
  action,
  computed,
  runInAction,
  reaction,
  makeObservable,
} from 'mobx';
import agent from '../api/agent';
import { RootStore } from './rootStore';
import {
  ICollectedOperationData,
  ITotals,
  CompleteStats,
  ICompleteStats,
  IOpportunitiesByUser,
} from '../models/operation';

// configure({ enforceActions: 'always' });

export default class homeStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    makeObservable(this, {
      loadingInitial: observable,
      submitting: observable,
      operationsRegistry: observable.shallow,
      operationsTotalRegistry: observable.shallow,
      operationsByUserRegistry: observable.shallow,
      body: observable,
      dataFetched: observable,
      pipelineTimeRange: observable,
      leadsChart: observable,
      leadsChartTimeRange: observable,
      opportunitiesChart: observable,
      opportunitiesChartTimeRange: observable,
      composedChartTimeRange: observable,
      selectedEvent: observable,
      stats: observable,
      pipelineData: computed.struct,
      thisMonthStats: computed.struct,
      leadsChartData: computed.struct,
      leadsOverallData: computed.struct,
      leadsBySourceData: computed.struct,
      opportunitiesChartData: computed.struct,
      opportunitiesOverallData: computed.struct,
      opportunitiesByEmployeeData: computed.struct,
      setTimeRange: action,
      loadOperations: action,
      showLeadsChart: action,
      showOpportunitiesChart: action,
    });

    this.rootStore = rootStore;

    // reaction(
    //   () => this.axiosParams,
    //   () => {
    //     this.loadTasks();
    //   }
    // );
    // this.loadOperations();
  }
  /////////////////////////////////////
  //collections
  operationsRegistry = new Map();
  operationsTotalRegistry = new Map();
  operationsByUserRegistry = new Map();
  //instances
  selectedEvent: Object | undefined;
  stats: ICompleteStats = new CompleteStats();
  //controls
  loadingInitial = false;
  submitting = false;
  dataFetched = false;
  body: string = '';
  pipelineTimeRange = false;
  leadsChart = false;
  leadsChartTimeRange = false;
  opportunitiesChart = false;
  opportunitiesChartTimeRange = false;
  composedChartTimeRange = false;
  //--------------------------------------------

  ////
  // *Computeds*
  //
  get pipelineData() {
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

  get thisMonthStats() {
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

  get leadsChartData() {
    if (!this.leadsChart && this.dataFetched) {
      return this.leadsBySourceData;
    } else if (this.dataFetched) return this.leadsOverallData;
    else return [];
  }

  get leadsOverallData() {
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

  get leadsBySourceData() {
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

  get opportunitiesChartData() {
    if (!this.opportunitiesChart && this.dataFetched) {
      return this.opportunitiesByEmployeeData;
    } else if (this.dataFetched) return this.opportunitiesOverallData;
    else return [];
  }

  get opportunitiesOverallData() {
    let chartProps: Array<{
      name: Date;
      leads: number;
      opportunities: number;
    }> = [];
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

  get opportunitiesByEmployeeData() {
    let chartProps: Array<{
      name: string;
      leads: number;
      opportunities: number;
    }> = [];
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
  //----------------------------------------

  ////
  // *Actions*
  //
  // Loading and submitting actions. According to MobX documentation it's recommended to
  // modify observables only by actions
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

  setTimeRange = (chart: string, range: boolean) => {
    this.submittingData(true);
    runInAction(() => {
      if (chart == 'leadsChart') this.leadsChartTimeRange = range;
      else if (chart == 'opportunitiesChart')
        this.opportunitiesChartTimeRange = range;
      else if (chart == 'composedChart') this.composedChartTimeRange = range;
      else if (chart == 'pipeline') this.pipelineTimeRange = range;
    });
    this.submittingData(false);
  };

  loadOperations = async () => {
    this.loadingData(true);
    try {
      const arr = [0, 1, 2, 3, 4, 5];
      let i = 0;
      const operations = await agent.Operations.list();
      const { ...data } = operations;
      const operationsByDate: Array<ICompleteStats> = Array.from(
        Object.values(data)
      );

      runInAction(() => {
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
      });
      this.loadingData(false);
    } catch (error) {
      this.loadingData(false);
      console.log(error);
    }
  };

  showLeadsChart = () => {
    this.loadingData(true);
    runInAction(() => {
      this.leadsChart = !this.leadsChart;
    });
    this.loadingData(false);
  };

  showOpportunitiesChart = () => {
    this.loadingData(true);
    runInAction(() => {
      this.opportunitiesChart = !this.opportunitiesChart;
    });
    this.loadingData(false);
  };

  //Pipeline
}
