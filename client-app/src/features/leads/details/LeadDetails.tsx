import React, { Fragment, useContext, useEffect } from 'react';
import { Header, Divider, Label, Segment, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import LoaderComponent from '../../../app/layout/LoaderComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';

export const LeadDetails: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadingInitial,
    selectedLead,
    selectLead,
    deleteLead,
    submitting,
    editLeadForm,
    showLeadForm,
    rr,
  } = rootStore.leadStore;

  useEffect(() => {}, [showLeadForm, rr]);

  if (loadingInitial) return <LoaderComponent content="Loading..." />;
  return (
    <Segment>
      <Button
        floated="right"
        icon="close"
        onClick={() => {
          selectLead('');
        }}
      />
      <Fragment key={selectedLead!.id}>
        <Header as="h2" width={16}>
          Details about {selectedLead!.name}
        </Header>

        <Divider clearing />

        <Label as="a" color="red" ribbon>
          Date added {selectedLead!.dateAdded!.toString()}
        </Label>

        <Header as="h3">Deals</Header>
        <div>Successful:</div>
        <div>Unsuccessful:</div>

        <Divider section />

        <Header as="h3">Notes</Header>
        {selectedLead!.notes}
        <Button.Group widths={2}>
          <Button
            onClick={() => editLeadForm(selectedLead!.id!)}
            loading={submitting}
            primary
            content="Edit"
          />
          <Button
            onClick={() => deleteLead(selectedLead!.id!)}
            loading={submitting}
            negative
            content="Delete"
          />
        </Button.Group>
      </Fragment>
    </Segment>
  );
};

export default observer(LeadDetails);
