import React, { useContext } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { ToastContainer, Zoom } from 'react-toastify';
import { OrderList } from './OrderList';
import { OrderForm } from '../form/OrderForm';
import ContactStore from '../../../app/stores/contactStore';
import OrderStore from '../../../app/stores/orderStore';

export const OrderDashboard: React.FC = () => {
  const orderStore = useContext(OrderStore);
  const {
    showOrderForm,
    selectedOrder,
    addOrderForm,
    editOrderForm,
    deleteOrder,
  } = orderStore;

  return (
    <Grid stackable centered divided="vertically">
      {showOrderForm && (
        <OrderForm
          key={(selectedOrder && selectedOrder.id) || 0}
          order={selectedOrder!}
        />
      )}
      <Grid.Row>
        <Grid.Column width={2}>
          <Button positive content="Add order" onClick={addOrderForm} />
          <Button content="Order log" color="yellow" />
          {selectedOrder && (
            <Button
              content="Edit order"
              color="blue"
              onClick={() => editOrderForm(selectedOrder.id)}
            />
          )}
          {selectedOrder && (
            <Button
              negative
              content="Delete order"
              onClick={() => deleteOrder(selectedOrder.id)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={10}>
          <OrderList />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default observer(OrderDashboard);
