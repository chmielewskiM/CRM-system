import React, { useContext, useEffect } from 'react';
import { Table } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { format } from 'date-fns';
import { RootStoreContext } from '../../../app/stores/rootStore';

export const OrderList: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { modal } = rootStore.modalStore;

  const {
    ordersByDate,
    selectOrder,
    selectedOrder,
    typeOfOrder,
    showOrderForm,
    loadOrders,
    rr,
    orderList,
  } = rootStore.orderStore;

  useEffect(() => {
    loadOrders();
  }, [orderList]);

  return (
    <>
      <Table
        unstackable
        striped
        selectable
        size="small"
        className="table-container orders"
        scrollable="true"
        style={{ overflow: 'visible' }}
      >
        <Table.Header className="head">
          <Table.Row>
            <Table.HeaderCell>Client</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Product</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Price</Table.HeaderCell>
            <Table.HeaderCell>Date opened</Table.HeaderCell>
            <Table.HeaderCell>Notes</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {ordersByDate.map((order) => (
          <Table.Body key={order.id}>
            <Table.Row
              onClick={() => selectOrder(order.id)}
              active={selectedOrder !== undefined && selectedOrder.id == order.id}
            >
              <Table.Cell>{order.client}</Table.Cell>
              <Table.Cell>{typeOfOrder(order)}</Table.Cell>
              <Table.Cell>{order.product}</Table.Cell>
              <Table.Cell>{order.amount}</Table.Cell>
              <Table.Cell>{order.price}</Table.Cell>
              <Table.Cell>{order.dateOrderOpened}</Table.Cell>
              <Table.Cell>{order.notes}</Table.Cell>
            </Table.Row>
          </Table.Body>
        ))}
      </Table>
    </>
  );
};
export default observer(OrderList);
