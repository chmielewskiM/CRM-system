export interface IContact {
  id: string;
  name: string;
  type: string;
  company: string;
  phoneNumber: string;
  dateAdded?: Date;
  email: string;
  notes: string;
  status: string;
  successfulDeals: number;
  source: string;
  premium:boolean;
}

export class ContactFormValues implements Partial<IContact> {
  id: string = '';
  name: string = '';
  type: string = '';
  company: string = '';
  phoneNumber: string = '';
  dateAdded?: Date = new Date();
  email: string = '';
  notes: string = '';
  status: string = '';
  successfulDeals: number = 0;
  source: string = '';
  premium: boolean = false;

  constructor(init?: Partial<IContact>) {
    Object.assign(this, init);
  }
}

export interface ICompleteContactsData {
  contacts: IContact[];
  contactsTotal:number;
}

// export class CompleteContactsData implements ICompleteStats {
//   data: ICollectedOperationData[] = [];
//   totals = new Totals();
//   userStats: IOpportunitiesByUser[] = [];

//   constructor(init?: ICompleteStats) {
//     Object.assign(this, init);
//   }
// }