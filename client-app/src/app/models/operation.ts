export interface IOperation {
  id?: string;
  lead: number;
  opportunity: number;
  converted: number;
  order: number;
  revenue: number;
  source: string;
  date: Date;
}

export class OperationValues implements IOperation {
  id?: string;
  lead: number = 0;
  opportunity: number = 0;
  converted: number = 0;
  order: number = 0;
  revenue: number = 0;
  source: string = '';
  date: Date = new Date();

  constructor(init?: IOperation) {
    Object.assign(this, init);
  }
}
