import React, { useContext, Fragment, useEffect } from 'react';
import { Item, Button, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { orderButtons } from '../../../app/common/options/buttons';
import MinorHeader from '../../../app/common/headers/MinorHeader';
import { destructureDate } from '../../../app/common/util/util';
import LoaderComponent from '../../../app/layout/LoaderComponent';

export const OrderHistory: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadingInitial,
    closedOrdersByDate,
    selectOrder,
    selectedOrder,
    setOrderList,
    setOrderBy,
    loadOrders,
  } = rootStore.orderStore;
  useEffect(() => {
    setOrderList('allOrders', true);
    // setOrderBy('date');
    // loadOrders(true);
  }, []);
  if (loadingInitial) return <LoaderComponent content="Loading..." />;
  return (
    <Fragment>
      <MinorHeader as="h1" content="History" />
      <Segment className="order-history">
        <Button.Group basic floated="right" className="order-history__btn-group">
          {orderButtons.map((button) => (
            <Button
              key={button.key}
              as={button.as}
              content={button.content}
              size={button.size}
              compact={button.compact}
              className={button.className}
              onClick={(e) => setOrderList(button.functionArg, true, e.currentTarget)}
            />
          ))}
        </Button.Group>
        {closedOrdersByDate.map((order) => (
          <Item key={order.id} className={String(order.type)}>
            <Button
              circular
              icon="info"
              active={selectedOrder !== undefined && selectedOrder.id == order.id}
              onClick={() => selectOrder(order.id, true, order.clientName)}
            ></Button>
            <Item.Content>
              <Item.Header>
                Client: {order.clientName} Order#: {order.orderNumber} Product: {order.product}{' '}
              </Item.Header>
              <Item.Meta>
                <span>
                  Opened: {destructureDate(new Date(order.dateOrderOpened))} Closed:{' '}
                  {destructureDate(new Date(order.dateOrderClosed))}{' '}
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
