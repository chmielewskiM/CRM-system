import { observable, action, computed, configure, runInAction } from 'mobx';
import { toast } from 'react-toastify';
import { IOrder, OrderFormValues } from '../models/order';
import agent from '../api/agent';
import { RootStore } from './rootStore';

configure({ enforceActions: 'always' });

export default class OrderStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable orders: IOrder[] = [];

  @observable selectedOrder: IOrder | undefined;

  @observable loadingInitial = false;

  @observable showOrderForm = false;

  @observable submitting = false;

  @observable orderRegistry = new Map();

  @observable selectedValue: boolean = true;

  @observable orderList: string | null = window.localStorage.getItem('orderList');

  @observable rr = false;

  @action render() {
    this.rr = !this.rr;
  }

  @computed get ordersByDate() {
    return Array.from(this.orderRegistry.values())
      .slice(0)
      .sort((a, b) => Date.parse(b.dateOrderOpened) - Date.parse(a.dateOrderOpened));
  }

  @action toggleSelect = (value: any) => {
    this.selectedValue = !this.selectedValue;
    this.render();
  };

  @action setOrderList = (value: string) => {
    window.localStorage.setItem('orderList', value);
    this.orderList = window.localStorage.getItem('orderList');
    this.render();
  };

  @action loadOrders = async () => {
    this.loadingInitial = true;
    try {
      const orders = await agent.Orders.list();
      runInAction('Loading Orders', () => {
        orders.forEach((order) => {
          this.orderRegistry.set(order.id, order);
        });
        this.loadingInitial = false;
        this.selectedOrder = undefined;
        this.render();
      });
    } catch (error) {
      runInAction('Loading error', () => {
        this.loadingInitial = false;
      });
      console.log(error);
    }
  };
  typeOfOrder = (order: IOrder) => {
    var type = '';
    order.type ? (type = 'Sale') : (type = 'Purchase');

    return type;
  };
  @action selectOrder = (id: string) => {
    if (id !== '') {
      this.selectedOrder = this.orderRegistry.get(id);
      this.render();
    } else {
      this.selectedOrder = undefined;
      this.render();
    }
  };
  @action closeOrder = async (order: IOrder) => {
    // this.submitting = true;
    // try {
    //   order.dateOrderClosed = new Date(Date.now());
    //   await agent.Orders.update(order);
    //   runInAction('Loading orders', () => {
    //     this.orderRegistry.set(order.id, order);
    //     this.submitting = false;
    //     this.loadOrders();
    //   });
    // } catch (error) {
    //   runInAction('Loading orders', () => {});
    //   toast.error('Problem occured');
    //   console.log(error);
    // }
    // this.rootStore.modalStore.closeModal();
    // toast.success('Order closed');
  };
  @action addOrderForm = () => {
    this.selectedOrder = undefined;
    this.showOrderForm = true;
    this.submitting = false;
    this.render();
  };

  @action editOrderForm = (id: string) => {
    this.selectedOrder = this.orderRegistry.get(id);
    this.showOrderForm = true;
    this.render();
  };

  @action setShowOrderForm = (show: boolean) => {
    this.showOrderForm = show;
    this.render();
  };

  @action fillForm = () => {
    if (this.selectedOrder) {
      var selected = this.selectedOrder;
      var order = new OrderFormValues(selected);
      return order;
    }
    return new OrderFormValues();
  };

  @action addOrder = async (order: IOrder) => {
    this.submitting = true;
    try {
      var date = new Date(Date.now());
      order.dateOrderOpened = date;
      order.type = this.selectedValue;
      await agent.Orders.add(order);
      runInAction('Loading orders', () => {
        this.orderRegistry.set(order.id, order);
        toast.success('Order added');
        this.showOrderForm = false;
        this.submitting = false;
      });
    } catch (error) {
      runInAction('Loading orders', () => {
        this.submitting = false;
      });
      toast.error('Problem occured');
      console.log(error.response);
    }
  };

  @action editOrder = async (order: IOrder) => {
    this.submitting = true;
    if (this.selectedOrder !== order) {
      try {
        await agent.Orders.update(order);
        runInAction('Loading orders', () => {
          this.orderRegistry.set(order.id, order);
          this.showOrderForm = false;
          this.submitting = false;
        });
        this.render();
      } catch (error) {
        runInAction('Loading orders', () => {
          this.submitting = false;
        });
        toast.error('Problem occured');
        console.log(error);
      }
    } else {
      this.showOrderForm = false;
      this.submitting = false;
      this.render();
    }
  };

  @action deleteOrder = async (id: string) => {
    this.submitting = true;
    try {
      await agent.Orders.delete(id);
      runInAction('Loading orders', () => {
        this.orderRegistry.delete(this.selectedOrder!.id);
        this.selectedOrder = undefined;
        this.submitting = false;
      });
      this.render();
    } catch (error) {
      runInAction('Loading orders', () => {
        this.submitting = false;
      });
      console.log(error);
    }
  };
}
