import {
  observable,
  action,
  computed,
  configure,
  runInAction,
  reaction,
} from 'mobx';
import { toast } from 'react-toastify';
import { IOrder, OrderFormValues } from '../models/order';
import agent from '../api/agent';
import { RootStore } from './rootStore';
import { v4 as uuid } from 'uuid';
import { IContact } from '../models/contact';
import { SyntheticEvent } from 'react';
import { InputOnChangeData } from 'semantic-ui-react';
import { number } from '@amcharts/amcharts4/core';

configure({ enforceActions: 'always' });

export default class OrderStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    reaction(
      () => this.axiosParams,
      () => {
        if (!this.closedOrders) this.loadOrders(false);
        else this.loadOrders(true);
      }
    );
  }

  ////
  //Observables
  ////
  @observable orders: IOrder[] = [];

  @observable selectedOrder: IOrder | undefined;

  @observable selectedClient: IContact | undefined;

  @observable temporaryContact: IContact | undefined;

  //URLparams
  @observable allOrders = true;

  @observable saleOrders = false;

  @observable closedOrders = false;

  @observable sortOrdersBy = 'date';

  @observable sortDescending = true;

  @observable filterInput: string = 'unfiltered';
  //""""""""""""""

  //pagination
  @observable pageSize = 5;

  @observable activePage = 1;
  //""""""""""""""

  //controls
  @observable loadingInitial = false;

  @observable showOrderForm = false;

  @observable displayHistory = false;

  @observable submitting = false;

  @observable sale: boolean = true;

  @observable rr = false;
  //""""""""""""""

  //collections
  @observable openOrderRegistry = new Map();

  @observable closedOrderRegistry = new Map();
  //----------------------------------------------------

  ////
  //Computeds
  ////
  @computed get axiosParams() {
    const params = new URLSearchParams();
    params.append('allOrders', `${this.allOrders}`);
    params.append('saleOrders', `${this.saleOrders}`);
    params.append('closedOrders', `${this.closedOrders}`);
    params.append('orderBy', `${this.sortOrdersBy}`);
    params.append('filterInput', `${this.filterInput}`);
    params.append('pageNumber', `${this.activePage}`);
    params.append('pageSize', `${this.pageSize}`);
    return params;
  }

  @action render() {
    this.rr = !this.rr;
  }

  @computed get openOrdersByDate() {
    return Array.from(this.openOrderRegistry.values());
  }

  @computed get closedOrdersByDate() {
    return Array.from(this.closedOrderRegistry.values());
  }
  //-------------------------------

  ////
  //Actions
  ////
  @action toggleSelect = (value: any) => {
    this.sale = !value;
    this.render();
  };

  @action setOrderList = (value: string, closed: boolean, ev?: HTMLElement) => {
    if (ev?.parentElement) {
      for (var child of ev?.parentElement!.children)
        child.classList.remove('active');
      ev?.classList.add('active');
    }
    runInAction('Sorting orders', () => {
      switch (value) {
        case 'allOrders':
          this.allOrders = true;
          this.closedOrders = closed;
          break;
        case 'saleOrders':
          this.allOrders = false;
          this.saleOrders = false;
          this.closedOrders = closed;
          break;
        case 'purchaseOrders':
          this.allOrders = false;
          this.saleOrders = true;
          this.closedOrders = closed;
          break;
      }

      this.loadOrders(closed);
    });
  };

  @action setOrderBy = (value: string) => {
    runInAction('Sorting orders', () => {
      this.closedOrders = false;
      this.sortDescending = !this.sortDescending;
      let orderBy;
      if (!this.sortDescending) {
        orderBy = value.concat('_desc');
      } else {
        orderBy = value.concat('_asc');
      }
      this.sortOrdersBy = orderBy;
    });
  };

  @action setPagination = (pageSize: number, activePage: number) => {
    this.pageSize = pageSize;
    this.activePage = activePage;
  };

  @action handleSearch = (ev: SyntheticEvent, input: InputOnChangeData) => {
    runInAction('Sorting orders', () => {
      this.filterInput = 'unfiltered';
      if (input.value.length > 1) {
        this.closedOrders = false;
        this.filterInput = input.value;
        this.loadOrders(false);
      }
    });
  };

  @action loadOrders = async (closed: boolean) => {
    this.loadingInitial = true;
    try {
      const orders = await agent.Orders.list(this.axiosParams);
      runInAction('Loading orders', () => {
        if (!closed) {
          this.openOrderRegistry.clear();
          orders.forEach((order) => {
            this.openOrderRegistry.set(order.id, order);
          });
        } else {
          this.closedOrderRegistry.clear();
          orders.forEach((order) => {
            this.closedOrderRegistry.set(order.id, order);
          });
        }
        this.loadingInitial = false;
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
  @action selectOrder = async (
    id: string,
    closed?: boolean,
    selectedOrder?: IOrder
  ) => {
    if (id !== '') {
      var order = new OrderFormValues(selectedOrder);
      runInAction('Selecting order', () => {
        if (!closed) this.selectedOrder = this.openOrderRegistry.get(id);
        else this.selectedOrder = this.closedOrderRegistry.get(id);
        this.sale = this.selectedOrder!.type;
      });
      this.render();
    } else {
      this.selectedOrder = undefined;
      this.render();
    }
  };

  @action addTemporaryContact = (contact: IContact) => {
    runInAction('Removing temporary contact', () => {
      this.rootStore.contactStore.contactRegistry.set(contact.id, contact);
      this.temporaryContact = contact;
      this.selectedClient = contact;
    });
  };
  @action removeTemporaryContact = () => {
    runInAction('Removing temporary contact', () => {
      this.rootStore.contactStore.contactRegistry.delete(
        this.temporaryContact?.id
      );
      this.temporaryContact = undefined;
      this.selectedClient = undefined;
    });
  };

  @action closeOrder = async (order: IOrder) => {
    this.submitting = true;
    try {
      // let order = this.openOrderRegistry.get(id)
      await agent.Orders.closeOrder(order);
      runInAction('Loading orders', () => {
        this.closedOrderRegistry.set(order.id, order);
        this.submitting = false;
        this.loadOrders(true);
      });
    } catch (error) {
      runInAction('Loading orders', () => {});
      toast.error('Problem occured');
      console.log(error);
    }
    this.rootStore.modalStore.closeModal();
    toast.success('Order closed');
  };
  @action addOrderForm = () => {
    this.selectedOrder = undefined;
    this.showOrderForm = true;
    this.submitting = false;
    this.render();
  };

  @action editOrderForm = async (id: string) => {
    this.submitting = true;
    const order = new OrderFormValues(this.selectedOrder);
    var contact = await agent.Contacts.get(encodeURI(order.clientName!));
    runInAction('Loading orders', () => {
      if (
        !this.rootStore.contactStore.contactRegistry.has(contact.id) &&
        contact.id
      ) {
        this.addTemporaryContact(contact);
      } else this.selectedClient = contact;
      this.rootStore.contactStore.selectedContact = contact;
      this.selectedOrder = this.openOrderRegistry.get(id);
      this.showOrderForm = true;
      this.submitting = false;
    });

    this.render();
  };

  @action setShowOrderForm = (show: boolean) => {
    this.showOrderForm = show;
    if (!show) this.rootStore.contactStore.selectContact('');

    if (this.temporaryContact && show == false) this.removeTemporaryContact();

    this.render();
  };

  @action fillForm = () => {
    if (this.selectedOrder) {
      this.sale = this.selectedOrder.type;
      return this.selectedOrder;
    } else {
      return new OrderFormValues();
    }
  };

  handleFinalFormSubmit = (values: any) => {
    const { ...order } = values;
    if (!order.id) {
      let newOrder = {
        ...order,
        id: uuid(),
      };
      this.addOrder(newOrder);
    } else {
      this.editOrder(order);
    }
  };

  @action addOrder = async (order: IOrder) => {
    this.submitting = true;
    try {
      order.client = this.rootStore.contactStore.selectedContact!;
      var date = new Date(Date.now());
      order.dateOrderOpened = date;
      order.type = this.sale;
      order.clientId = this.rootStore.contactStore.selectedContact?.id!;
      await agent.Orders.add(order);
      runInAction('Loading orders', () => {
        this.openOrderRegistry.set(order.id, order);
        toast.success('Order added');
        this.setShowOrderForm(false);
        this.submitting = false;
      });
      this.loadOrders(false);
      this.render();
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
        order.clientId = this.rootStore.contactStore.selectedContact?.id!;
        await agent.Orders.update(order);
        runInAction('Editing order', () => {
          this.openOrderRegistry.set(order.id, order);
          this.showOrderForm = false;
          this.submitting = false;
        });
        if (this.temporaryContact) this.removeTemporaryContact();
        this.loadOrders(false);
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
      runInAction('Deleting order', () => {
        this.openOrderRegistry.delete(this.selectedOrder!.id);
        this.selectedOrder = undefined;
        this.submitting = false;
      });
      this.render();
    } catch (error) {
      runInAction('Deleting order', () => {
        this.submitting = false;
      });
      console.log(error);
    }
  };
  @action setDisplayHistory = (value: boolean) => {
    this.displayHistory = value;
    this.render();
  };
}
