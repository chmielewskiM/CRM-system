import React, { useContext, useEffect, useState } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { AdminPanelForm } from '../form/AdminPanelForm';

export const AdminPanelDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { rr, inputValue } = rootStore.userStore;

  useEffect(() => {
    console.log('ADash');
  }, [rr]);

  const [form, setForm] = useState(true);
  // if (contactStore.loadingInitial)
  //   return <LoaderComponent content="Loading..." />;

  return (
    <Grid className="main-grid">
      <Grid.Row columns={16} className="wrapper admin-panel">
        <Grid.Column mobile={15} tablet={8} computer={3} className="control">
          <Button.Group className="cbuttons">
            <Button
              content="Add user"
              type="reset"
              onClick={() => {
                setForm(true);
              }}
            />
            <Button
              content="Edit user"
              onClick={() => {
                setForm(false);
              }}
            />
          </Button.Group>
        </Grid.Column>

        <Grid.Column mobile={16} tablet={12} computer={10} className="form">
          <AdminPanelForm form={form} value={inputValue} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default observer(AdminPanelDashboard);
