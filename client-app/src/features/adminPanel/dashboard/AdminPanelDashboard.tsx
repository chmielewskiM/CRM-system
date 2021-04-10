import React, { useEffect, useState } from 'react';
import { Grid, Button, Container, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../app/stores/rootStore';
import AdminPanelForm from '../form/AdminPanelForm';

export const AdminPanelDashboard: React.FC = () => {
  const { userStore } = useStores();

  useEffect(() => {
    userStore.getUserList();
  }, []);

  const [form, setForm] = useState(true);

  const activateBtn = (ev: HTMLElement) => {
    if (ev.parentElement) {
      for (var child of ev.parentElement!.children)
        child.classList.remove('active');
      ev.classList.add('active');
    }
  };

  return (
    <Grid className="main-grid  admin-panel">
      <Grid.Row columns={16} className="wrapper">
        <Segment className="buttons-container" attached="top">
          <Button.Group>
            <Button
              content="Add user"
              className="active"
              onClick={(ev) => {
                setForm(true);
                activateBtn(ev.currentTarget);
              }}
            />
            <Button
              content="Edit user"
              onClick={(ev) => {
                setForm(false);
                activateBtn(ev.currentTarget);
              }}
            />
          </Button.Group>
        </Segment>
        <Segment className="form-container" attached="bottom">
          <AdminPanelForm form={form} />
        </Segment>
      </Grid.Row>
    </Grid>
  );
};

export default observer(AdminPanelDashboard);
