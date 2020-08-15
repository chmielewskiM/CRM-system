export interface IOrder {
  id: string;
  client: string;
  type: boolean;
  product: string;
  amount: ConstrainDouble;
  price: ConstrainDouble;
  dateOrderOpened?: Date;
  dateOrderClosed?: Date;
  notes: string;
}
export interface IOrderForm extends Partial<IOrder> {
  timeOrderOpened?: Date;
  timeOrderClosed?: Date;
}

export class OrderFormValues implements IOrderForm {
  id: string = '';
  client: string = '';
  type?: boolean = undefined;
  product: string = '';
  amount: ConstrainDouble = 0;
  price?: ConstrainDouble = undefined;
  dateOrderOpened?: Date = undefined;
  timeOrderOpened?: Date = undefined;
  dateOrderClosed?: Date = undefined;
  timeOrderClosed?: Date = undefined;
  notes: string = '';

  constructor(init?: IOrderForm) {
    if (init && init.dateOrderOpened) {
      init.timeOrderOpened = init.dateOrderOpened;
    }
    Object.assign(this, init);
  }
}
