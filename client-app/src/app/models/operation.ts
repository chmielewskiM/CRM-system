export interface IOperation {
  id?: string;
  lead: number;
  opportunity: number;
  quote: number;
  invoice: number;
  conversion: number;
  order: number;
  revenue: number;
  source: string;
  date: Date;
}

export class OperationValues implements IOperation {
  id?: string;
  lead: number = 0;
  opportunity: number = 0;
  quote: number = 0;
  invoice: number = 0;
  conversion: number = 0;
  order: number = 0;
  revenue: number = 0;
  source: string = '';
  date: Date = new Date();

  constructor(init?: IOperation) {
    Object.assign(this, init);
  }
}

export interface ISources {
  web: number;
  socialMedia: number;
  flyers: number;
  commercial: number;
  formerClient: number;
}

export class Sources {
  web: number = 0;
  socialMedia: number = 0;
  flyers: number = 0;
  commercial: number = 0;
  formerClient: number = 0;
}

export interface ITotals {
  leadsTotal: number;
  opportunitiesTotal: number;
  quotesTotal: number;
  invoicesTotal: number;
  conversionsTotal: number;
  ordersTotal: number;
  revenueTotal: number;
  sourcesTotal: ISources;
}

export class Totals {
  leadsTotal: number = 0;
  opportunitiesTotal: number = 0;
  quotesTotal: number = 0;
  invoicesTotal: number = 0;
  conversionsTotal: number = 0;
  ordersTotal: number = 0;
  revenueTotal: number = 0;
  sourcesTotal: ISources = new Sources();
}

export interface ICollectedOperationData {
  key?: number;
  leads: number;
  opportunities: number;
  quotes: number;
  invoices: number;
  conversions: number;
  orders: number;
  revenue: number;
  sources: ISources;
  dateStart: Date;
  dateEnd: Date;
}
export interface ICollected {
  data: ICollectedOperationData[];
}
export class Collected implements ICollected {
  data: ICollectedOperationData[] = [new CollectedOperationData()];

  constructor(init?: ICollected, type?: number) {
    Object.assign(this, init, type);
  }
}

export class CollectedOperationData implements ICollectedOperationData {
  leads: number = 0;
  opportunities: number = 0;
  quotes: number = 0;
  invoices: number = 0;
  conversions: number = 0;
  orders: number = 0;
  revenue: number = 0;
  sources: ISources = new Sources();
  dateStart: Date = new Date();
  dateEnd: Date = new Date();

  constructor(init?: ICollectedOperationData) {
    Object.assign(this, init);
  }
}

export interface IOpportunitiesByUser {
  userDisplayName: string;
  leadsTotal: number;
  opportunitiesTotal: number;
}

export class OpportunitiesByUser implements IOpportunitiesByUser {
  userDisplayName = '';
  leadsTotal = 0;
  opportunitiesTotal = 0;
}

export interface ICompleteStats {
  totals?: ITotals;
  data: ICollectedOperationData[];
  userStats: IOpportunitiesByUser[];
}

export class CompleteStats implements ICompleteStats {
  data: ICollectedOperationData[] = [];
  totals = new Totals();
  userStats: IOpportunitiesByUser[] = [];

  constructor(init?: ICompleteStats) {
    Object.assign(this, init);
  }
}
