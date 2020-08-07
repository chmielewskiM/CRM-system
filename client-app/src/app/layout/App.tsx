import React, { useEffect, Fragment, useContext } from 'react';
import { Container } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import {
  Route,
  Switch,
  withRouter,
  RouteComponentProps,
} from 'react-router-dom';
import { ToastContainer, Zoom } from 'react-toastify';
import { Navbar } from '../../features/nav/Navbar';
import { ContactDashboard } from '../../features/contacts/dashboard/ContactDashboard';
import LoaderComponent from './LoaderComponent';
import ContactStore from '../stores/contactStore';
import StockStore from '../stores/stockStore';
import OrderStore from '../stores/orderStore';
import { Homepage } from '../../features/contacts/home/Homepage';
import { SignIn } from '../../features/signin/SignIn';
import { OrderDashboard } from '../../features/orders/dashboard/OrderDashboard';
import { StockDashboard } from '../../features/stock/dashboard/StockDashboard';
import { DelegatedTaskDashboard } from '../../features/delegatedTasks/dashboard/DelegatedTaskDashboard';
import DelegatedTaskStore from '../stores/delegatedTaskStore';
import { loadavg } from 'os';

const App: React.FC<RouteComponentProps> = ({ history }) => {
  const contactStore = useContext(ContactStore);
  const delegatedTaskStore = useContext(DelegatedTaskStore);

  useEffect(() => {
  }, [history, contactStore.render, delegatedTaskStore.render]);

  return (
    <>
      <ToastContainer
        autoClose={2000}
        transition={Zoom}
        hideProgressBar
        position="bottom-right"
      />
      <Route exact path="/" component={SignIn} />
      <Route
        path="/(.+)"
        render={() => (
          <>
            <Navbar />
            <Container className="wrapper">
              <Route path="/contacts" component={ContactDashboard} />
              <Route path="/tasks" component={DelegatedTaskDashboard} />
              <Route path="/orders" component={OrderDashboard} />
              <Route path="/stock" component={StockDashboard} />
            </Container>
          </>
        )}
      />
    </>
  );
};

export default withRouter(observer(App));
