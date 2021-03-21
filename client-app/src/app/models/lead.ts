import { ContactFormValues, IContact } from './contact';
import { IOperation } from './operation';
import { IOrder, OrderFormValues } from './order';
import { IUser } from './user';

export interface ILead{
  contact: IContact;
  order?: IOrder;
  source: string;
}

export class LeadFormValues implements ILead {
  contact = new ContactFormValues();
  order? = new OrderFormValues();
  source = '';

  constructor(init?:ILead) {
    Object.assign(this, init);
  }
}

export class Lead {
  contact: IContact = new ContactFormValues();
  order: IOrder = new OrderFormValues();
  source: string = '';
  constructor(init?: ILead) {
    Object.assign(this, init);
  }
}
