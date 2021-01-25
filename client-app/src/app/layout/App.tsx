import React, { useEffect, useContext } from 'react';
import { Container } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Route, withRouter, RouteComponentProps } from 'react-router-dom';
import { ToastContainer, Zoom } from 'react-toastify';
import { Navbar } from '../../features/nav/Navbar';
import { ContactDashboard } from '../../features/contacts/dashboard/ContactDashboard';
import LoaderComponent from './LoaderComponent';
import { SignIn } from '../../features/signin/SignIn';
import { OrderDashboard } from '../../features/orders/dashboard/OrderDashboard';
import { StockDashboard } from '../../features/stock/dashboard/StockDashboard';
import { DelegatedTaskDashboard } from '../../features/delegatedTasks/dashboard/DelegatedTaskDashboard';
import { RootStoreContext } from '../stores/rootStore';
import { HomeDashboard } from '../../features/home/dashboard/HomeDashboard';
import { LeadDashboard } from '../../features/leads/dashboard/LeadDashboard';
import AdminPanelDashboard from '../../features/adminPanel/dashboard/AdminPanelDashboard';
// import 'mobx-react-lite/batchingForReactDom'

const App: React.FC<RouteComponentProps> = ({ history }) => {
  const rootStore = useContext(RootStoreContext);
  const { appLoaded, setAppLoaded, token } = rootStore.commonStore;
  const { getUser } = rootStore.userStore;

  useEffect(() => {
    if (token) {
      // getUser().finally(() => setAppLoaded());
    } else {
      setAppLoaded();
    }
  }, [
    history,
    getUser,
    setAppLoaded,
    token,
    rootStore.homeStore.rr,
    rootStore.contactStore.rr,
    rootStore.leadStore.rr,
    rootStore.delegatedTaskStore.rr,
    rootStore.orderStore.rr,
    rootStore.stockStore.rr,
    rootStore.modalStore.rr,
  ]);
  // if (!appLoaded) return <LoaderComponent />;

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
              <Route path="/dashboard" component={HomeDashboard} />
              <Route path="/contacts" component={ContactDashboard} />
              <Route path="/leads" component={LeadDashboard} />
              <Route path="/tasks" component={DelegatedTaskDashboard} />
              <Route path="/orders" component={OrderDashboard} />
              <Route path="/stock" component={StockDashboard} />
              <Route path="/panel" component={AdminPanelDashboard} />
            </Container>
          </>
        )}
      />
    </>
  );
};

export default withRouter(observer(App));
