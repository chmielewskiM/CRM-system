import React, { useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Route, withRouter, RouteComponentProps } from 'react-router-dom';
import { ToastContainer, Zoom } from 'react-toastify';
import Navbar from '../../features/nav/Navbar';
import ContactDashboard from '../../features/contacts/dashboard/ContactDashboard';
import SignIn from '../../features/signin/SignIn';
import OrderDashboard from '../../features/orders/dashboard/OrderDashboard';
import DelegatedTaskDashboard from '../../features/delegatedTasks/dashboard/DelegatedTaskDashboard';
import { useStores } from '../stores/rootStore';
import HomeDashboard from '../../features/home/dashboard/HomeDashboard';
import LeadDashboard from '../../features/leads/dashboard/LeadDashboard';
import AdminPanelDashboard from '../../features/adminPanel/dashboard/AdminPanelDashboard';

const App: React.FC<RouteComponentProps> = ({ history }) => {
  const { commonStore, userStore, homeStore } = useStores();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getLoggedUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [
    history,
    userStore.getUser,
    commonStore.setAppLoaded,
    commonStore.token,
    userStore,
    commonStore,
    homeStore,
  ]);

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
            <Container fluid className="wrapper">
              <Route path="/dashboard" component={HomeDashboard} />
              <Route path="/contacts" component={ContactDashboard} />
              <Route path="/leads" component={LeadDashboard} />
              <Route path="/tasks" component={DelegatedTaskDashboard} />
              <Route path="/orders" component={OrderDashboard} />
              <Route path="/panel" component={AdminPanelDashboard} />
            </Container>
          </>
        )}
      />
    </>
  );
};

export default withRouter(observer(App));
