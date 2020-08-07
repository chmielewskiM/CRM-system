import React, { useContext, Fragment } from 'react';
import { Table } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import OrderStore from '../../../app/stores/orderStore';

export const OrderList: React.FC = () => {
  const orderStore = useContext(OrderStore);
  const { ordersByDate, selectOrder, selectedOrder, selected } = orderStore;

  return (
    <>
      <Table celled selectable sortable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Orders taken</Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell>Client</Table.HeaderCell>
            <Table.HeaderCell>Product</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Price</Table.HeaderCell>
            <Table.HeaderCell>Date opened</Table.HeaderCell>
            <Table.HeaderCell>Deadline</Table.HeaderCell>
            <Table.HeaderCell>Notes</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {ordersByDate.map((order) => (
          <Table.Body key={order.id}>
            <Table.Row
              onClick={() => selectOrder(order.id)}
              active={
                selectedOrder !== undefined && selectedOrder.id == order.id
              }
            >
              <Table.Cell>{order.client}</Table.Cell>
              <Table.Cell>{order.product}</Table.Cell>
              <Table.Cell>{order.amount}</Table.Cell>
              <Table.Cell>{order.price}</Table.Cell>
              <Table.Cell>{order.dateOrderOpened}</Table.Cell>
              <Table.Cell>{order.deadline}</Table.Cell>
              <Table.Cell>{order.notes}</Table.Cell>
            </Table.Row>
          </Table.Body>
        ))}
      </Table>
    </>
  );
};
export default observer(OrderList);
