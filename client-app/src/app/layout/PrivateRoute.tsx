import React from 'react';
import {
  RouteProps,
  RouteComponentProps,
  Redirect,
  Route,
} from 'react-router-dom';
import { useStores } from '../stores/rootStore';
import { observer } from 'mobx-react-lite';

interface IProps extends RouteProps {
  component: React.ComponentType<RouteComponentProps<any>>;
}

const PrivateRoute: React.FC<IProps> = ({ component: Component, ...rest }) => {
  const { userStore } = useStores();

  return (
    <Route
      {...rest}
      render={(props) =>
        userStore.user ? <Component {...props} /> : <Redirect to={'/'} />
      }
    />
  );
};

export default observer(PrivateRoute);
