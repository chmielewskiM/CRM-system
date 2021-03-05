import React, { Fragment, useContext, useEffect } from 'react';
import { Segment, Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import LoaderComponent from '../../../app/layout/LoaderComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { destructureDate } from '../../../app/common/util/util';
import MinorHeader from '../../../app/common/headers/MinorHeader';

export const OrderDetails: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { loadingInitial, selectedOrder, selectOrder, rr } = rootStore.orderStore;

  useEffect(() => {}, [rr]);

  const isOrderClosed = () => {
    let dateClosed = new Date(selectedOrder?.dateOrderClosed!).getFullYear();
    let result = dateClosed! > 2019 ? true : false;
    return result;
  };

  if (loadingInitial) return <LoaderComponent content="Loading..." />;
  return (
    <Fragment>
      <MinorHeader
        as="h1"
        content={`Order #${selectedOrder?.orderNumber} details`}
        function={() => selectOrder('')}
      />
      <Segment basic className="order-details">
        <Fragment key={selectedOrder!.id}>
          <Grid>
            <Grid.Column>
              <Grid.Row>
                <span className="detail">Client: </span>
                <span className="detail-value">{selectedOrder?.clientName}</span>
              </Grid.Row>
              {selectedOrder && selectedOrder.type && (
                <Grid.Row>
                  <span className="detail">Transaction: </span>{' '}
                  <span className="detail-value">Sale</span>
                </Grid.Row>
              )}
              {selectedOrder && !selectedOrder.type && (
                <Grid.Row>
                  <span className="detail">Transaction: </span>{' '}
                  <span className="detail-value">Purchase</span>
                </Grid.Row>
              )}
              <Grid.Row>
                <span className="detail">Opened: </span>{' '}
                <span className="detail-value">
                  {destructureDate(new Date(selectedOrder!.dateOrderOpened))}
                </span>
              </Grid.Row>
              {isOrderClosed() && (
                <Grid.Row>
                  <span className="detail">Closed: </span>
                  <span className="detail-value">
                    {destructureDate(new Date(selectedOrder!.dateOrderClosed))}
                  </span>
                </Grid.Row>
              )}
              <Grid.Row>
                <span className="detail">Product: </span>
                <span className="detail-value">{selectedOrder?.product}</span>
              </Grid.Row>
              <Grid.Row>
                <span className="detail">Amount: </span>
                <span className="detail-value">{selectedOrder?.amount}</span>
              </Grid.Row>
              <Grid.Row>
                <span className="detail">Price: </span>
                <span className="detail-value">{selectedOrder?.price}</span>
              </Grid.Row>
              <Grid.Row>
                <span className="detail">Notes: </span>
                <span className="detail-value">{selectedOrder?.notes}</span>
              </Grid.Row>
            </Grid.Column>
          </Grid>
        </Fragment>
      </Segment>
    </Fragment>
  );
};

export default observer(OrderDetails);
