import React, { useContext, useEffect, Fragment } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { OrderList } from './OrderList';
import { OrderForm } from '../form/OrderForm';
import { RootStoreContext } from '../../../app/stores/rootStore';

export const OrderDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { openModal, modal } = rootStore.modalStore;

  const {
    showOrderForm,
    selectedOrder,
    addOrderForm,
    editOrderForm,
    deleteOrder,
    setOrderList,
    rr,
  } = rootStore.orderStore;

  useEffect(() => {
  }, [rr]);

  return (
    <Fragment>
      <Grid stackable centered divided="vertically" className="main-grid">
        {showOrderForm && (
          <OrderForm key={(selectedOrder && selectedOrder.id) || 0} order={selectedOrder!} />
        )}
        <Grid.Row className="buttons-row">
          <Button positive content="Add order" onClick={addOrderForm} />
          <Button
            content="All orders"
            color="yellow"
            onClick={() => {
              setOrderList('default');
            }}
          />
          <Button
            content="Open orders"
            color="yellow"
            onClick={() => {
              setOrderList('open');
            }}
          />
          <Button
            content="Closed orders"
            color="yellow"
            onClick={() => {
              setOrderList('closed');
            }}
          />
          {selectedOrder && (
            <Button
              content="Edit order"
              color="blue"
              onClick={() => editOrderForm(selectedOrder.id)}
            />
          )}
          {selectedOrder && new Date(selectedOrder.dateOrderClosed!).getFullYear() < 2 && (
            <Button negative content="Mark as done" onClick={() => openModal('as', '', '')} />
          )}
          {selectedOrder && (
            <Button negative content="Delete order" onClick={() => deleteOrder(selectedOrder.id)} />
          )}
          <Button
            icon="angle down"
            className="expand-menu"
            onClick={(event) => rootStore.commonStore.expandMenu(event)}
          />
        </Grid.Row>
        <Grid.Row className="row-content-1">
          <Grid.Column width={10}>
            <OrderList />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Fragment>
  );
};

export default observer(OrderDashboard);
