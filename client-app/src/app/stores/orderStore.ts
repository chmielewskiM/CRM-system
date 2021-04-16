import {
  observable,
  action,
  computed,
  configure,
  runInAction,
  reaction,
  makeObservable,
} from 'mobx';
import { toast } from 'react-toastify';
import { IOrder, OrderFormValues } from '../models/order';
import agent from '../api/agent';
import { RootStore } from './rootStore';
import { v4 as uuid } from 'uuid';
import { IContact } from '../models/contact';
import { SyntheticEvent } from 'react';
import { InputOnChangeData } from 'semantic-ui-react';

configure({ enforceActions: 'always' });

export const PAGE_SIZE = 5;

export default class OrderStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    makeObservable(this, {
      orders: observable,
      selectedOrder: observable,
      selectedClient: observable,
      temporaryContact: observable,
      allOrders: observable,
      saleOrders: observable,
      closedOrders: observable,
      sortOrdersBy: observable,
      sortDescending: observable,
      filterInput: observable,
      pageSize: observable,
      activePage: observable,
      ordersCount: observable,
      loadingInitial: observable,
      showOrderForm: observable,
      displayHistory: observable,
      submitting: observable,
      sale: observable,
      openOrderRegistry: observable,
      closedOrderRegistry: observable,
      axiosParams: computed,
      openOrdersByDate: computed,
      closedOrdersByDate: computed,
      toggleSelect: action,
      setOrderList: action,
      setOrderBy: action,
      setPagination: action,
      handleSearch: action,
      loadOrders: action,
      selectOrder: action,
      addTemporaryContact: action,
      removeTemporaryContact: action,
      closeOrder: action,
      addOrderForm: action,
      editOrderForm: action,
      setShowOrderForm: action,
      fillForm: action,
      addOrder: action,
      editOrder: action,
      deleteOrder: action,
      setDisplayHistory: action,
    });

    this.rootStore = rootStore;
    reaction(
      () => this.axiosParams,
      () => {
        if (!this.closedOrders) this.loadOrders();
        else this.loadHistory();
      }
    );
    // reaction(
    //   () => this.showOrderForm,
    //   () => {
    //     this.rootStore.contactStore.loadUncontracted();
    //   }
    // );
  }

  /////////////////////////////////////
  //collections
  openOrderRegistry = new Map();
  closedOrderRegistry = new Map();
  orders: IOrder[] = [];
  //instances
  selectedOrder: IOrder | undefined;
  selectedClient: IContact | undefined;
  temporaryContact: IContact | undefined;
  //controls
  loadingInitial = false;
  submitting = false;
  displayHistory = false;
  sale: boolean = true;
  showOrderForm = false;
  //URLparams
  allOrders = true;
  saleOrders = false;
  closedOrders = false;
  sortOrdersBy = 'date';
  sortDescending = true;
  filterInput: string = 'unfiltered';
  //pagination
  pageSize = 5;
  activePage = 0;
  ordersCount = 0;
  //----------------------------------------------

  ////
  //Computeds
  //
  get axiosParams() {
    const params = new URLSearchParams();
    params.append('allOrders', `${this.allOrders}`);
    params.append('saleOrders', `${this.saleOrders}`);
    params.append('closedOrders', `${this.closedOrders}`);
    params.append('orderBy', `${this.sortOrdersBy}`);
    params.append('filterInput', `${this.filterInput}`);
    params.append('pageNumber', `${this.activePage}`);
    params.append('pageSize', `${PAGE_SIZE}`);
    return params;
  }

  get openOrdersByDate() {
    return Array.from(this.openOrderRegistry.values());
  }

  get closedOrdersByDate() {
    return Array.from(this.closedOrderRegistry.values());
  }
  //-------------------------------

  ////
  //*Actions*
  //
  // Loading and submitting actions. According to MobX documentation it's
  // observables should be modified only by actions
  loadingData = (value: boolean) => {
    runInAction(() => {
      this.loadingInitial = value;
    });
  };

  submittingData = (value: boolean) => {
    runInAction(() => {
      this.submitting = value;
    });
  };

  selectOrder = async (
    id: string,
    closed?: boolean,
    selectedOrder?: IOrder
  ) => {
    runInAction(() => {
      if (id !== '') {
        var order = new OrderFormValues(selectedOrder);
        if (!closed) this.selectedOrder = this.openOrderRegistry.get(id);
        else this.selectedOrder = this.closedOrderRegistry.get(id);
        this.sale = this.selectedOrder!.type;
      } else {
        this.selectedOrder = undefined;
      }
    });
  };

  toggleSelect = () => {
    runInAction(() => {
      this.sale = !this.sale;
    });
  };

  handleSearch = (ev: SyntheticEvent, input: InputOnChangeData) => {
    runInAction(() => {
      this.filterInput = 'unfiltered';
      if (input.value.length > 1) {
        this.closedOrders = false;
        this.filterInput = input.value;
        this.loadOrders();
      }
    });
  };

  addTemporaryContact = (contact: IContact) => {
    runInAction(() => {
      this.rootStore.contactStore.contactRegistry.set(contact.id, contact);
      this.temporaryContact = contact;
      this.selectedClient = contact;
    });
  };

  removeTemporaryContact = () => {
    runInAction(() => {
      this.rootStore.contactStore.contactRegistry.delete(
        this.temporaryContact?.id
      );
      this.temporaryContact = undefined;
      this.selectedClient = undefined;
    });
  };

  setDisplayHistory = (value: boolean) => {
    runInAction(() => {
      this.displayHistory = value;
    });
  };

  typeOfOrder = (order: IOrder) => {
    var type = '';
    order.type ? (type = 'Sale') : (type = 'Purchase');
    return type;
  };

  // sorting and filtering
  setOrderList = (value: string, closed: boolean, ev?: HTMLElement) => {
    if (ev?.parentElement) {
      for (var child of ev?.parentElement!.children)
        child.classList.remove('active');
      ev?.classList.add('active');
    }
    runInAction(() => {
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
      if (!this.closedOrders) this.loadOrders();
      else this.loadHistory;
    });
  };

  setOrderBy = (value: string) => {
    runInAction(() => {
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

  setPagination = (activePage: number) => {
    runInAction(() => {
      this.closedOrders = true;
      if (activePage >= 1) this.activePage = activePage;
    });
  };
  //----------------------------------------

  // *Forms*
  addOrderForm = () => {
    this.loadingData(true);
    runInAction(() => {
      this.selectedOrder = undefined;
    });
    this.setShowOrderForm(true);
    this.loadingData(false);
  };

  editOrderForm = async (id: string) => {
    this.loadingData(true);
    const order = new OrderFormValues(this.selectedOrder);
    this.rootStore.contactStore.getContact(encodeURI(order.clientName!));
    const contact = await agent.Contacts.getContact(
      encodeURI(order.clientName!)
    );
    runInAction(() => {
      if (
        !this.rootStore.contactStore.contactRegistry.has(contact.id) &&
        contact.id
      ) {
        this.addTemporaryContact(contact);
      } else this.selectedClient = contact;
      this.rootStore.contactStore.selectedContact = contact;
      this.selectedOrder = this.openOrderRegistry.get(id);
    });
    this.setShowOrderForm(true);
    this.loadingData(false);
  };

  setShowOrderForm = (show: boolean) => {
    runInAction(() => {
      this.showOrderForm = show;
    });
    if (!show) this.rootStore.contactStore.selectContact('');
    if (this.temporaryContact && show == false) this.removeTemporaryContact();
  };

  fillForm = () => {
    if (this.selectedOrder) {
      this.rootStore.contactStore.getContact(this.selectedOrder?.clientName!);
      this.rootStore.contactStore.selectContact(this.selectedClient?.id!);
      runInAction(() => {
        this.sale = this.selectedOrder!.type;
      });
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
  //----------------------------------------

  // *CRUD order*
  loadOrders = async () => {
    this.loadingData(true);
    runInAction(() => {
      this.closedOrders = false;
    });
    try {
      const data = await agent.Orders.listOrders(this.axiosParams);
      const [...orders] = data.orders;
      const count = data.ordersCount;
      runInAction(() => {
        this.openOrderRegistry.clear();
        orders.forEach((order) => {
          this.openOrderRegistry.set(order.id, order);
        });
      });
      this.loadingData(false);
    } catch (error) {
      this.loadingData(false);
      console.log(error);
    }
  };

  loadHistory = async () => {
    this.loadingData(true);
    runInAction(() => {
      this.closedOrders = true;
    });
    try {
      const data = await agent.Orders.listOrders(this.axiosParams);
      const [...orders] = data.orders;
      const count = data.ordersCount;
      runInAction(() => {
        this.closedOrderRegistry.clear();
        orders.forEach((order) => {
          this.closedOrderRegistry.set(order.id, order);
        });
        this.ordersCount = count;
      });
      this.loadingData(false);
    } catch (error) {
      this.loadingData(false);
      console.log(error);
    }
  };

  addOrder = async (order: IOrder) => {
    this.submittingData(true);
    try {
      order.client = this.rootStore.contactStore.selectedContact!;
      var date = new Date(Date.now());
      order.dateOrderOpened = date;
      order.type = this.sale;
      order.clientId = this.rootStore.contactStore.selectedContact?.id!;
      await agent.Orders.addOrder(order);
      runInAction(() => {
        this.openOrderRegistry.set(order.id, order);
        this.closedOrders = false;
      });
      toast.success('Order added');
      this.setShowOrderForm(false);
      this.submittingData(false);
      this.loadOrders();
      this.rootStore.contactStore.loadUncontracted();
    } catch (error) {
      this.submittingData(false);
      toast.error(error.data.errors.message);
      console.log(error)
    }
  };

  editOrder = async (order: IOrder) => {
    this.submittingData(true);
    if (this.selectedOrder !== order) {
      try {
        order.clientId = this.rootStore.contactStore.selectedContact?.id!;
        await agent.Orders.updateOrder(order);
        runInAction(() => {
          this.openOrderRegistry.set(order.id, order);
        });
        this.setShowOrderForm(false);
        if (this.temporaryContact) this.removeTemporaryContact();
        this.submittingData(false);
        this.loadOrders();
      } catch (error) {
        this.setShowOrderForm(false);
        this.submittingData(false);
        if (error.status == 304) {
          toast.info('There were no changes.');
        } else toast.error(error.data.errors.message);
        console.log(error);
      }
    } else {
      this.setShowOrderForm(false);
      this.submittingData(false);
    }
  };

  deleteOrder = async (id: string) => {
    this.submittingData(true);
    try {
      await agent.Orders.deleteOrder(id);
      runInAction(() => {
        this.openOrderRegistry.delete(this.selectedOrder!.id);
        this.selectedOrder = undefined;
      });
      this.submittingData(false);
      await this.setOrderList('allOrders', false);
      await this.setOrderList('allOrders', true);
      this.rootStore.contactStore.loadUncontracted();
      toast.success('Order deleted successfully.');
    } catch (error) {
      this.submittingData(false);
      console.log(error);
      toast.error(error.data.errors.message);
    }
  };

  closeOrder = async (order: IOrder) => {
    this.submittingData(true);
    try {
      // let order = this.openOrderRegistry.get(id)
      await agent.Orders.closeOrder(order);
      runInAction(() => {
        this.closedOrderRegistry.set(order.id, order);
      });
      this.submittingData(false);
      this.selectOrder('');
      this.loadOrders();
      this.loadHistory();
    } catch (error) {
      this.submittingData(false);
      toast.error('Problem occured');
      console.log(error);
    }
    this.rootStore.modalStore.closeModal();
    toast.success('Order closed');
  };
}
