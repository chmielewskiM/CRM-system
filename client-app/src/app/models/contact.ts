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
}

export class ContactFormValues implements Partial<IContact> {
  id: string = '';
  name: string = '';
  type: string = '';
  company: string = '';
  phoneNumber: string = '';
  dateAdded?: Date = undefined;
  email: string = '';
  notes: string = '';
  status: string ='';

  constructor(init?: Partial<IContact>) {
    Object.assign(this, init);
  }
}
