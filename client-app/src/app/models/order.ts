import { IContact, ContactFormValues } from "./contact";

export interface IOrder {
  id: string;
  orderNumber: number;
  clientId: string;
  client?: IContact;
  clientName?: string;
  type: boolean;
  closed: boolean;
  product: string;
  amount: ConstrainDouble;
  price: ConstrainDouble;
  dateOrderOpened: Date;
  dateOrderClosed: Date;
  notes: string;
}
export interface IOrderForm extends Partial<IOrder> {
  timeOrderOpened?: Date;
  timeOrderClosed?: Date;
}

export class OrderFormValues implements Partial<IOrder> {
  id: string = '';
  orderNumber: number = 0;
  clientId: string = '';
  // client: IContact = new ContactFormValues();
  clientName?: string = '';
  type: boolean = false;
  closed: boolean = false;
  product: string = '';
  amount: ConstrainDouble = 0;
  price: ConstrainDouble = 0;
  dateOrderOpened: Date = new Date();
  dateOrderClosed: Date = new Date(0);
  notes: string = '';

  constructor(init?: IOrder) {
    // if (init && init.dateOrderOpened) {
    //   init.timeOrderOpened = init.dateOrderOpened;
    // }
    Object.assign(this, init);
  }
}
