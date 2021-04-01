import React, { Fragment, useEffect } from 'react';
import { Segment, Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import LoaderComponent from '../../../app/layout/LoaderComponent';
import { useStores } from '../../../app/stores/rootStore';
import MinorHeader from '../../../app/common/headers/MinorHeader';
import { destructureDate } from '../../../app/common/util/util';

export const DelegatedTaskDetails: React.FC = () => {
  const { delegatedTaskStore } = useStores();

  useEffect(() => {}, []);

  return (
    <Fragment>
      <MinorHeader
        as="h1"
        content={'Task details'}
        // controls={true}
        function={() => delegatedTaskStore.selectTask('')}
        className="task-details-header"
      />
      <Segment basic className="task-details">
        {delegatedTaskStore.loadingInitial && (
          <LoaderComponent content="Loading..." />
        )}
        <Fragment key={delegatedTaskStore.selectedTask!.id}>
          <Grid>
            <Grid.Column>
              <Grid.Row>
                <span className="detail">Task: </span>
                <span className="detail-value">
                  {delegatedTaskStore.selectedTask?.type}
                </span>
              </Grid.Row>
              <Grid.Row>
                <span className="detail">Created by: </span>{' '}
                <span className="detail-value">
                  {delegatedTaskStore.selectedTask?.access.createdBy}
                </span>
              </Grid.Row>
              <Grid.Row>
                <span className="detail">Shared with: </span>{' '}
                <span className="detail-value">
                  {delegatedTaskStore.selectedTask?.access.sharedWith}
                </span>
              </Grid.Row>
              <Grid.Row>
                <span className="detail">Date started: </span>{' '}
                <span className="detail-value">
                  {destructureDate(
                    new Date(delegatedTaskStore.selectedTask!.dateStarted)
                  )}
                </span>
              </Grid.Row>
              <Grid.Row>
                <span className="detail">Deadline: </span>{' '}
                <span className="detail-value">
                  {destructureDate(
                    new Date(delegatedTaskStore.selectedTask!.deadline)
                  )}
                </span>
              </Grid.Row>

              {delegatedTaskStore.selectedTask?.finishedBy != '' && (
                <Grid.Row>
                  <span className="detail">Finished by: </span>{' '}
                  <span className="detail-value">
                    {delegatedTaskStore.selectedTask?.finishedBy}
                  </span>
                </Grid.Row>
              )}
              <Grid.Row>
                <span className="detail">Notes: </span>{' '}
                <span className="detail-value">
                  {delegatedTaskStore.selectedTask?.notes}
                </span>
              </Grid.Row>
            </Grid.Column>
          </Grid>
        </Fragment>
      </Segment>
    </Fragment>
  );
};

export default observer(DelegatedTaskDetails);
