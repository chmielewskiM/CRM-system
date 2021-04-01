import React, { useEffect, Fragment } from 'react';
import { Table, Icon } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../app/stores/rootStore';
import { destructureDate } from '../../../app/common/util/util';
import LoaderComponent from '../../../app/layout/LoaderComponent';
import { IOrder } from '../../../app/models/order';

export const OrderList: React.FC = () => {
  const { orderStore } = useStores();

  useEffect(() => {}, []);

  return (
    <Fragment>
      {orderStore.loadingInitial && !orderStore.closedOrders && (
        <LoaderComponent content="Loading..." />
      )}
      <Table
        unstackable
        striped
        selectable
        sortable={true}
        size="small"
        className="table-container orders"
        scrollable="true"
        style={{ overflow: 'visible' }}
      >
        <Table.Header className="head">
          <Table.Row>
            <Table.HeaderCell onClick={() => orderStore.setOrderBy('name')}>
              Client
              {orderStore.sortOrdersBy == 'name_desc' && (
                <Icon name="sort descending" />
              )}
              {orderStore.sortOrdersBy == 'name_asc' && (
                <Icon name="sort ascending" />
              )}
              {orderStore.sortOrdersBy !== 'name_asc' &&
                orderStore.sortOrdersBy !== 'name_desc' && (
                  <Icon name="sort descending" className="unset-icon" />
                )}
            </Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Product</Table.HeaderCell>
            <Table.HeaderCell onClick={() => orderStore.setOrderBy('amount')}>
              Amount
              {orderStore.sortOrdersBy == 'amount_desc' && (
                <Icon name="sort descending" />
              )}
              {orderStore.sortOrdersBy == 'amount_asc' && (
                <Icon name="sort ascending" />
              )}
              {orderStore.sortOrdersBy !== 'amount_asc' &&
                orderStore.sortOrdersBy !== 'amount_desc' && (
                  <Icon name="sort descending" className="unset-icon" />
                )}
            </Table.HeaderCell>
            <Table.HeaderCell onClick={() => orderStore.setOrderBy('price')}>
              Price
              {orderStore.sortOrdersBy == 'price_desc' && (
                <Icon name="sort descending" />
              )}
              {orderStore.sortOrdersBy == 'price_asc' && (
                <Icon name="sort ascending" />
              )}
              {orderStore.sortOrdersBy !== 'price_asc' &&
                orderStore.sortOrdersBy !== 'price_desc' && (
                  <Icon name="sort descending" className="unset-icon" />
                )}
            </Table.HeaderCell>
            <Table.HeaderCell onClick={() => orderStore.setOrderBy('date')}>
              Date opened
              {orderStore.sortOrdersBy == 'date_desc' && (
                <Icon name="sort descending" />
              )}
              {orderStore.sortOrdersBy == 'date_asc' && (
                <Icon name="sort ascending" />
              )}
              {orderStore.sortOrdersBy !== 'date_asc' &&
                orderStore.sortOrdersBy !== 'date_desc' && (
                  <Icon name="sort descending" className="unset-icon" />
                )}
            </Table.HeaderCell>
            <Table.HeaderCell>Notes</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {orderStore.openOrdersByDate.map((order: IOrder) => (
          <Table.Body key={order.id}>
            <Table.Row
              onClick={() => orderStore.selectOrder(order.id, false, order)}
              active={
                orderStore.selectedOrder !== undefined &&
                orderStore.selectedOrder.id == order.id
              }
            >
              <Table.Cell>{order.clientName}</Table.Cell>
              <Table.Cell>{orderStore.typeOfOrder(order)}</Table.Cell>
              <Table.Cell>{order.product}</Table.Cell>
              <Table.Cell>{order.amount}</Table.Cell>
              <Table.Cell>{order.price}</Table.Cell>
              <Table.Cell>
                {destructureDate(new Date(order.dateOrderOpened))}
              </Table.Cell>
              <Table.Cell className="notes-cell">{`[Order #${order.orderNumber}]: ${order.notes}`}</Table.Cell>
            </Table.Row>
          </Table.Body>
        ))}
      </Table>
    </Fragment>
  );
};
export default observer(OrderList);
