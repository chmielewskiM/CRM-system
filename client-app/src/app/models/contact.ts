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

  constructor(init?: Partial<IContact>) {
    Object.assign(this, init);
  }
}
