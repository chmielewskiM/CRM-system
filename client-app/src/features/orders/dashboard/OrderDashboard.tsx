import React, { useContext, useEffect, Fragment } from 'react';
import { Grid, Button, GridColumn, Label, Segment, Input } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { OrderList } from '../list/OrderList';
import { OrderForm } from '../form/OrderForm';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { OrderDetails } from '../details/OrderDetails';
import { OrderHistory } from '../history/OrderHistory';
import { orderButtons } from '../../../app/common/options/buttons';
import HistoryPagination from '../../../app/common/pagination/HistoryPagination';

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
    closeOrder,
    handleSearch,
    setPagination,
    rr,
  } = rootStore.orderStore;

  useEffect(() => {
  }, [rr]);

  return (
    <Fragment>
      <Grid stackable centered className="main-grid orders">
        {showOrderForm && (
          <OrderForm key={(selectedOrder && selectedOrder.id) || 0} className={'order-form'} />
        )}
        <Grid.Row className="topbar">
          <Button positive icon="plus" content="Add order" onClick={addOrderForm} />
          {selectedOrder && (
            <Button
              icon="pencil alternate"
              content="Edit order"
              color="blue"
              onClick={() => editOrderForm(selectedOrder.id)}
            />
          )}
          {selectedOrder && new Date(selectedOrder.dateOrderClosed!).getFullYear() < 2000 && (
            // onClick={() => openModal('as', '', '')}
            <Button
              negative
              icon="check"
              content="Close order"
              onClick={() => closeOrder(selectedOrder)}
            />
          )}
          {selectedOrder && (
            <Button
              negative
              icon="eraser"
              content="Delete order"
              onClick={() => deleteOrder(selectedOrder.id)}
            />
          )}
          <Button
            icon="angle down"
            className="expand-menu"
            onClick={(event) => rootStore.commonStore.expandMenu(event)}
          />
        </Grid.Row>
        <Grid.Row className="row-content-1 orders">
          <Segment attached="top" floated="left" className="filter-buttons">
            <Button.Group floated="left">
              <Label basic content="Filter orders:" />
              {orderButtons.map((button:any) => (
                <Button
                  key={button.key}
                  as={button.as}
                  content={button.content}
                  size={button.size}
                  compact={button.compact}
                  className={button.className}
                  onClick={(e) => setOrderList(button.functionArg, false, e.currentTarget)}
                />
              ))}
            </Button.Group>
            <Input className="filter-input" onChange={handleSearch} icon="search" label="Search" />
          </Segment>
          <Segment attached="bottom" className="list">
            <Grid.Column width={16} className='list-col'>
              <OrderList />
            </Grid.Column>
          </Segment>
        </Grid.Row>
        <Grid.Row className="row-content-2">
          <GridColumn mobile={10} computer={7} className='details-col'>
            {selectedOrder && <OrderDetails />}
          </GridColumn>
          <Grid.Column computer={6} mobile={10}>
            <OrderHistory />
            <HistoryPagination
              totalPages={10}
              onPageChange={(pageSize, activePage) => setPagination(pageSize, activePage)}
              pageSize={5}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Fragment>
  );
};

export default observer(OrderDashboard);
