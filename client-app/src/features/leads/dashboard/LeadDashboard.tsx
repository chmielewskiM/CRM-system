import React, { useContext, useEffect } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { LeadList } from './LeadList';
import { LeadDetails } from '../details/LeadDetails';
import { LeadForm } from '../form/LeadForm';
import { RootStoreContext } from '../../../app/stores/rootStore';

export const LeadDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { showLeadForm, selectedLead, addLeadForm, selectLead, status } = rootStore.leadStore;

  useEffect(() => {}, [showLeadForm, status]);

  // if (contactStore.loadingInitial)
  //   return <LoaderComponent content="Loading..." />;

  return (
    <Grid stackable divided="vertically">
      {showLeadForm && <LeadForm key={(selectedLead && selectedLead.id) || 0} contact={selectedLead!} />}
      <Grid.Row>
        <Grid.Column>
          <LeadList />
          <Button positive circular size="big" icon="plus" content="Create lead" onClick={addLeadForm} />
          <Button content="Call log" />
        </Grid.Column>
      </Grid.Row>

      <Grid.Row columns={6}>
        <Grid.Column width={6}>{selectedLead !== undefined && <LeadDetails />}</Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default observer(LeadDashboard);
