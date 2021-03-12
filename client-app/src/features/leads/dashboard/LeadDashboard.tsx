import React, { useContext, useEffect } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { LeadList } from '../list/LeadList';
import { LeadDetails } from '../details/LeadDetails';
import { LeadForm } from '../form/LeadForm';
import { RootStoreContext } from '../../../app/stores/rootStore';

export const LeadDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    showLeadForm,
    selectedLead,
    addLeadForm,
    selectLead,
    status,
    loadLeads,
  } = rootStore.leadStore;

  useEffect(() => {
    loadLeads(status);
  }, [showLeadForm, status]);

  // if (contactStore.loadingInitial)
  //   return <LoaderComponent content="Loading..." />;

  return (
    <Grid className="main-grid">
      {showLeadForm && (
        <LeadForm key={(selectedLead && selectedLead.id) || 0} contact={selectedLead!} />
      )}
      <Grid.Row className="topbar">
        <Button positive icon="plus" content="Add lead" onClick={addLeadForm} />
        <Button
          icon="angle down"
          className="expand-menu"
          onClick={(event) => rootStore.commonStore.expandMenu(event)}
        />
      </Grid.Row>
      <Grid.Row className="row-content-1 leads">
        <Grid.Column mobile={16} tablet={14} computer={14}>
          <LeadList />
        </Grid.Column>
      </Grid.Row>

      <Grid.Row columns={6}>
        <Grid.Column width={6}>{selectedLead !== undefined && <LeadDetails />}</Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default observer(LeadDashboard);
