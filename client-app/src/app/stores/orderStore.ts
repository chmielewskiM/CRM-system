import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, FormEvent } from "react";
import agent from "../api/agent";
import { IOrder } from "../models/order";

configure({ enforceActions: "always" });

class OrderStore {
  @observable orders: IOrder[] = [];
  @observable selectedOrder: IOrder | undefined;
  @observable loadingInitial = false;
  @observable showOrderForm = false;
  @observable submitting = false;
  @observable orderRegistry = new Map();
  @observable selected: string | undefined = undefined;

  @computed get ordersByDate() {
    return Array.from(this.orderRegistry.values());
    //   .slice(0)
    //   .sort((a, b) => Date.parse(b.dateAdded) - Date.parse(a.dateAdded));
  }

  @action loadOrders = async () => {
    this.loadingInitial = true;
    try {
      const orders = await agent.Orders.list();
      runInAction("Loading orders", () => {
        orders.forEach((order) => {
          this.orderRegistry.set(order.id, order);
        });
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction("Loading error", () => {
        this.loadingInitial = false;
      });
      console.log(error);
    }
  };

  @action selectOrder = (id: string) => {
    if (id !== "") {
      this.selectedOrder = this.orderRegistry.get(id);
      this.selected = "1";
      console.log(this.selectedOrder);
    } else {
      this.selectedOrder = undefined;
    }
  };

  @action addOrderForm = () => {
    console.log("forma");
    this.selectedOrder = undefined;
    this.showOrderForm = true;
  };

  @action editOrderForm = (id: string) => {
    this.selectedOrder = this.orderRegistry.get(id);
    this.showOrderForm = true;
  };

  @action setShowOrderForm = (show: boolean) => {
    this.showOrderForm = show;
  };

  @action addOrder = async (order: IOrder) => {
    this.submitting = true;
    try {
      await agent.Orders.add(order);
      runInAction("Loading orders", () => {
        this.orderRegistry.set(order.id, order);
        this.showOrderForm = false;
        this.submitting = false;
      });
    } catch (error) {
      runInAction("Loading orders", () => {
        this.submitting = false;
      });
      console.log(error);
    }
  };

  @action editOrder = async (order: IOrder) => {
    this.submitting = true;

    if (this.selectedOrder !== order) {
      try {
        await agent.Orders.update(order);
        runInAction("Loading orders", () => {
          this.orderRegistry.set(order.id, order);
          this.selectedOrder = order;
          this.showOrderForm = false;
          this.submitting = false;
        });
      } catch (error) {
        runInAction("Loading orders", () => {
          this.submitting = false;
        });
        console.log(error);
      }
    } else {
      this.showOrderForm = false;
      this.submitting = false;
    }
  };

  @action deleteOrder = async (id: string) => {
    this.submitting = true;
    try {
      await agent.Orders.delete(id);
      runInAction("Deleting order", () => {
        this.orderRegistry.delete(this.selectedOrder!.id);
        this.selectedOrder = undefined;
        this.submitting = false;
      });
    } catch (error) {
      runInAction("Deleting order", () => {
        this.submitting = false;
      });
      console.log(error);
    }
  };
}

export default createContext(new OrderStore());
