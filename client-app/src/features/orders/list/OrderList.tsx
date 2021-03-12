import React, { useContext, useEffect, Fragment } from 'react';
import { Table, Icon } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { destructureDate } from '../../../app/common/util/util';
import LoaderComponent from '../../../app/layout/LoaderComponent';

export const OrderList: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { modal } = rootStore.modalStore;

  const {
    loadingInitial,
    openOrdersByDate,
    selectOrder,
    selectedOrder,
    typeOfOrder,
    loadOrders,
    setOrderList,
    setOrderBy,
    sortOrdersBy,
  } = rootStore.orderStore;

  useEffect(() => {
    setOrderList('allOrders', false);
  
  }, []);
  if (loadingInitial) return <LoaderComponent content="Loading..." />;
  return (
    <Fragment>
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
            <Table.HeaderCell onClick={() => setOrderBy('name')}>
              Client
              {sortOrdersBy == 'name_desc' && <Icon name="sort descending" />}
              {sortOrdersBy == 'name_asc' && <Icon name="sort ascending" />}
              {sortOrdersBy !== 'name_asc' && sortOrdersBy !== 'name_desc' && (
                <Icon name="sort descending" className="unset-icon" />
              )}
            </Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Product</Table.HeaderCell>
            <Table.HeaderCell onClick={() => setOrderBy('amount')}>
              Amount
              {sortOrdersBy == 'amount_desc' && <Icon name="sort descending" />}
              {sortOrdersBy == 'amount_asc' && <Icon name="sort ascending" />}
              {sortOrdersBy !== 'amount_asc' && sortOrdersBy !== 'amount_desc' && (
                <Icon name="sort descending" className="unset-icon" />
              )}
            </Table.HeaderCell>
            <Table.HeaderCell onClick={() => setOrderBy('price')}>
              Price
              {sortOrdersBy == 'price_desc' && <Icon name="sort descending" />}
              {sortOrdersBy == 'price_asc' && <Icon name="sort ascending" />}
              {sortOrdersBy !== 'price_asc' && sortOrdersBy !== 'price_desc' && (
                <Icon name="sort descending" className="unset-icon" />
              )}
            </Table.HeaderCell>
            <Table.HeaderCell onClick={() => setOrderBy('date')}>
              Date opened
              {sortOrdersBy == 'date_desc' && <Icon name="sort descending" />}
              {sortOrdersBy == 'date_asc' && <Icon name="sort ascending" />}
              {sortOrdersBy !== 'date_asc' && sortOrdersBy !== 'date_desc' && (
                <Icon name="sort descending" className="unset-icon" />
              )}
            </Table.HeaderCell>
            <Table.HeaderCell>Notes</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {openOrdersByDate.map((order) => (
          <Table.Body key={order.id}>
            <Table.Row
              onClick={() => selectOrder(order.id, false, order)}
              active={selectedOrder !== undefined && selectedOrder.id == order.id}
            >
              <Table.Cell>{order.clientName}</Table.Cell>
              <Table.Cell>{typeOfOrder(order)}</Table.Cell>
              <Table.Cell>{order.product}</Table.Cell>
              <Table.Cell>{order.amount}</Table.Cell>
              <Table.Cell>{order.price}</Table.Cell>
              <Table.Cell>{destructureDate(new Date(order.dateOrderOpened))}</Table.Cell>
              <Table.Cell>{order.notes}</Table.Cell>
            </Table.Row>
          </Table.Body>
        ))}
      </Table>
    </Fragment>
  );
};
export default observer(OrderList);
