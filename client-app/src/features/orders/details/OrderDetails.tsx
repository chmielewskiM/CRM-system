import React, { Fragment, useEffect } from 'react';
import { Segment, Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import LoaderComponent from '../../../app/layout/LoaderComponent';
import { useStores } from '../../../app/stores/rootStore';
import { destructureDate } from '../../../app/common/util/util';
import MinorHeader from '../../../app/common/headers/MinorHeader';

export const OrderDetails: React.FC = () => {
  const { orderStore } = useStores();

  useEffect(() => {}, []);

  const isOrderClosed = () => {
    let dateClosed = new Date(
      orderStore.selectedOrder?.dateOrderClosed!
    ).getFullYear();
    let result = dateClosed! > 2019 ? true : false;
    return result;
  };

  return (
    <Fragment>
      <MinorHeader
        as="h1"
        content={`Order #${orderStore.selectedOrder?.orderNumber} details`}
        function={() => orderStore.selectOrder('')}
      />
      <Segment basic className="order-details">
        {orderStore.loadingInitial && <LoaderComponent content="Loading..." />}
        <Fragment key={orderStore.selectedOrder!.id}>
          <Grid>
            <Grid.Column>
              <Grid.Row>
                <span className="detail">Client: </span>
                <span className="detail-value">
                  {orderStore.selectedOrder?.clientName}
                </span>
              </Grid.Row>
              {orderStore.selectedOrder && orderStore.selectedOrder.type && (
                <Grid.Row>
                  <span className="detail">Transaction: </span>{' '}
                  <span className="detail-value">Sale</span>
                </Grid.Row>
              )}
              {orderStore.selectedOrder && !orderStore.selectedOrder.type && (
                <Grid.Row>
                  <span className="detail">Transaction: </span>{' '}
                  <span className="detail-value">Purchase</span>
                </Grid.Row>
              )}
              <Grid.Row>
                <span className="detail">Opened: </span>{' '}
                <span className="detail-value">
                  {destructureDate(
                    new Date(orderStore.selectedOrder!.dateOrderOpened)
                  )}
                </span>
              </Grid.Row>
              {isOrderClosed() && (
                <Grid.Row>
                  <span className="detail">Closed: </span>
                  <span className="detail-value">
                    {destructureDate(
                      new Date(orderStore.selectedOrder!.dateOrderClosed)
                    )}
                  </span>
                </Grid.Row>
              )}
              <Grid.Row>
                <span className="detail">Product: </span>
                <span className="detail-value">
                  {orderStore.selectedOrder?.product}
                </span>
              </Grid.Row>
              <Grid.Row>
                <span className="detail">Amount: </span>
                <span className="detail-value">
                  {orderStore.selectedOrder?.amount}
                </span>
              </Grid.Row>
              <Grid.Row>
                <span className="detail">Price: </span>
                <span className="detail-value">
                  {orderStore.selectedOrder?.price}
                </span>
              </Grid.Row>
              <Grid.Row>
                <span className="detail">Notes: </span>
                <span className="detail-value">
                  {orderStore.selectedOrder?.notes}
                </span>
              </Grid.Row>
            </Grid.Column>
          </Grid>
        </Fragment>
      </Segment>
    </Fragment>
  );
};

export default observer(OrderDetails);
