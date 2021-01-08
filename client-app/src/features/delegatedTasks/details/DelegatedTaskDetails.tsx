import React, { Fragment, useContext, useEffect } from 'react';
import { Header, Divider, Segment, Button, Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import LoaderComponent from '../../../app/layout/LoaderComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';

export const DelegatedTaskDetails: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadingInitial,
    selectedDelegatedTask,
    selectDelegatedTask,
    deleteDelegatedTask,
    submitting,
    editDelegatedTaskForm,
    showDelegatedTaskForm,
    rr,
  } = rootStore.delegatedTaskStore;

  useEffect(() => {}, [rr]);

  if (loadingInitial) return <LoaderComponent content="Loading..." />;
  return (
    <Segment basic className="task details">
      <Fragment key={selectedDelegatedTask!.id}>
        <Grid>
          <Grid.Row className="header">
            <Header as="h2">{selectedDelegatedTask!.type}</Header>
            <Button
              icon="close"
              onClick={() => {
                selectDelegatedTask('');
              }}
            />
          </Grid.Row>
          <Divider />
          <Grid.Row columns="equal">
            <Grid.Column>
              <Grid.Row>From: {selectedDelegatedTask?.assignment}</Grid.Row>
              <Grid.Row>Priority: {selectedDelegatedTask?.assignment}</Grid.Row>
              <Grid.Row>Notes: {selectedDelegatedTask!.notes}</Grid.Row>
            </Grid.Column>
            <Grid.Column>
              <Grid.Row>Received: </Grid.Row>
              <Grid.Row>Deadline:</Grid.Row>
              <Grid.Row>Contact</Grid.Row>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Fragment>
    </Segment>
  );
};

export default observer(DelegatedTaskDetails);
