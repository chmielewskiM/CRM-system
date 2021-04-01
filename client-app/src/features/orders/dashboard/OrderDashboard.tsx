import React, { useEffect, Fragment } from 'react';
import {
  Grid,
  Button,
  GridColumn,
  Label,
  Segment,
  Input,
} from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import OrderList from '../list/OrderList';
import OrderForm from '../form/OrderForm';
import { useStores } from '../../../app/stores/rootStore';
import OrderDetails from '../details/OrderDetails';
import OrderHistory from '../history/OrderHistory';
import { orderButtons } from '../../../app/common/options/buttons';
import HistoryPagination from '../../../app/common/pagination/HistoryPagination';
import { PAGE_SIZE } from '../../../app/stores/orderStore';

export const OrderDashboard: React.FC = () => {
  const { orderStore, commonStore } = useStores();

  useEffect(() => {
    orderStore.setOrderList('allOrders', false);
    orderStore
      .loadOrders()
      .then(() => orderStore.setOrderList('allOrders', true))
      .then(() => orderStore.loadHistory());
  }, []);

  return (
    <Fragment>
      <Grid stackable centered className="main-grid orders">
        {orderStore.showOrderForm && (
          <OrderForm
            key={(orderStore.selectedOrder && orderStore.selectedOrder.id) || 0}
            className={'order-form'}
          />
        )}
        <Grid.Row className="topbar">
          <Button
            positive
            icon="plus"
            content="Add order"
            onClick={orderStore.addOrderForm}
          />
          {orderStore.selectedOrder && (
            <Button
              icon="pencil alternate"
              content="Edit order"
              color="blue"
              onClick={() =>
                orderStore.editOrderForm(orderStore.selectedOrder!.id)
              }
            />
          )}
          {orderStore.selectedOrder &&
            new Date(orderStore.selectedOrder.dateOrderClosed!).getFullYear() <
              2000 && (
              // onClick={() => openModal('as', '', '')}
              <Button
                negative
                icon="check"
                content="Close order"
                onClick={() => orderStore.closeOrder(orderStore.selectedOrder!)}
              />
            )}
          {orderStore.selectedOrder && (
            <Button
              negative
              icon="eraser"
              content="Delete order"
              onClick={() =>
                orderStore.deleteOrder(orderStore.selectedOrder!.id)
              }
            />
          )}
          <Button
            icon="angle down"
            className="expand-menu"
            onClick={(event) => commonStore.expandMenu(event)}
          />
        </Grid.Row>
        <Grid.Row className="row-content-1 orders">
          <Segment attached="top" floated="left" className="filter-buttons">
            <Button.Group floated="left">
              <Label basic content="Filter orders:" />
              {orderButtons.map((button: any) => (
                <Button
                  key={button.key}
                  as={button.as}
                  content={button.content}
                  size={button.size}
                  compact={button.compact}
                  className={button.className}
                  onClick={(e) =>
                    orderStore.setOrderList(
                      button.functionArg,
                      false,
                      e.currentTarget
                    )
                  }
                />
              ))}
            </Button.Group>
            <Input
              className="filter-input"
              onChange={orderStore.handleSearch}
              icon="search"
              label="Search"
            />
          </Segment>
          <Segment attached="bottom" className="list">
            <Grid.Column width={16} className="list-col">
              <OrderList />
            </Grid.Column>
          </Segment>
        </Grid.Row>
        <Grid.Row className="row-content-2">
          <GridColumn mobile={10} computer={7} className="details-col">
            {orderStore.selectedOrder && <OrderDetails />}
          </GridColumn>
          <Grid.Column computer={6} mobile={10}>
            <OrderHistory />
            <HistoryPagination
              itemsCount={orderStore.ordersCount}
              onPageChange={orderStore.setPagination}
              pageSize={PAGE_SIZE}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Fragment>
  );
};

export default observer(OrderDashboard);
