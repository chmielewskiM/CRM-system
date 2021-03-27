import React, { Fragment, useContext, useEffect } from 'react';
import { Segment, Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import LoaderComponent from '../../../app/layout/LoaderComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';
import MinorHeader from '../../../app/common/headers/MinorHeader';
import { destructureDate } from '../../../app/common/util/util';

export const DelegatedTaskDetails: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadingInitial,
    selectedTask,
    selectTask,
  } = rootStore.delegatedTaskStore;

  useEffect(() => {}, []);

  if (loadingInitial) return <LoaderComponent content="Loading..." />;
  return (
    <Fragment>
      <MinorHeader
        as="h1"
        content={'Task details'}
        // controls={true}
        function={() => selectTask('')}
        className="task-details-header"
      />
      <Segment basic className="task-details">
        <Fragment key={selectedTask!.id}>
          <Grid>
            <Grid.Column>
              <Grid.Row>
                <span className="detail">Task: </span>
                <span className="detail-value">{selectedTask?.type}</span>
              </Grid.Row>
              <Grid.Row>
                <span className="detail">Created by: </span>{' '}
                <span className="detail-value">
                  {selectedTask?.access.createdBy}
                </span>
              </Grid.Row>
              <Grid.Row>
                <span className="detail">Shared with: </span>{' '}
                <span className="detail-value">
                  {selectedTask?.access.sharedWith}
                </span>
              </Grid.Row>
              <Grid.Row>
                <span className="detail">Date started: </span>{' '}
                <span className="detail-value">
                  {destructureDate(new Date(selectedTask!.dateStarted))}
                </span>
              </Grid.Row>
              <Grid.Row>
                <span className="detail">Deadline: </span>{' '}
                <span className="detail-value">
                  {destructureDate(new Date(selectedTask!.deadline))}
                </span>
              </Grid.Row>

              {selectedTask?.finishedBy != '' && (
                <Grid.Row>
                  <span className="detail">Finished by: </span>{' '}
                  <span className="detail-value">
                    {selectedTask?.finishedBy}
                  </span>
                </Grid.Row>
              )}
              <Grid.Row>
                <span className="detail">Notes: </span>{' '}
                <span className="detail-value">{selectedTask?.notes}</span>
              </Grid.Row>
            </Grid.Column>
          </Grid>
        </Fragment>
      </Segment>
    </Fragment>
  );
};

export default observer(DelegatedTaskDetails);
