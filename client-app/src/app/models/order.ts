export interface IOrder {
  id: string;
  client: string;
  product: string;
  amount: ConstrainDouble;
  price: ConstrainDouble;
  dateOrderOpened: string;
  deadline: string;
  dateOrderClosed: string;
  notes: string;
}
