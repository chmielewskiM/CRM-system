import React, { Fragment, useEffect } from 'react';
import { Item, Button, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../app/stores/rootStore';
import { orderButtons } from '../../../app/common/options/buttons';
import MinorHeader from '../../../app/common/headers/MinorHeader';
import { destructureDate } from '../../../app/common/util/util';
import LoaderComponent from '../../../app/layout/LoaderComponent';

export const OrderHistory: React.FC = () => {
  const { orderStore } = useStores();

  useEffect(() => {}, []);

  return (
    <Fragment>
      <MinorHeader as="h1" content="History" />
      <Segment className="order-history">
        {orderStore.loadingInitial && orderStore.closedOrders && (
          <LoaderComponent content="Loading..." />
        )}
        <Button.Group
          basic
          floated="right"
          className="order-history__btn-group"
        >
          {orderButtons.map((button) => (
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
                  true,
                  e.currentTarget
                )
              }
            />
          ))}
        </Button.Group>
        {orderStore.closedOrdersByDate.map((order) => (
          <Item key={order.id} className={String(order.type)}>
            <Button
              circular
              icon="info"
              active={
                orderStore.selectedOrder !== undefined &&
                orderStore.selectedOrder.id == order.id
              }
              onClick={() =>
                orderStore.selectOrder(order.id, true, order.clientName)
              }
            ></Button>
            <Item.Content>
              <Item.Header>
                Client: {order.clientName} Order#: {order.orderNumber} Product:{' '}
                {order.product}{' '}
              </Item.Header>
              <Item.Meta>
                <span>
                  Opened: {destructureDate(new Date(order.dateOrderOpened))}{' '}
                  Closed: {destructureDate(new Date(order.dateOrderClosed))}{' '}
                </span>
              </Item.Meta>
            </Item.Content>
          </Item>
        ))}
      </Segment>
    </Fragment>
  );
};

export default observer(OrderHistory);
