import React, { Fragment, useEffect } from 'react';
import { Segment, Card } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import LoaderComponent from '../../../app/layout/LoaderComponent';
import { useStores } from '../../../app/stores/rootStore';
import  TaskNotification  from './TaskNotification';
import { MinorHeader } from '../../../app/common/headers/MinorHeader';

interface IProps {
  className: string;
  taskCount: number;
}

export const TaskNotifier: React.FC<IProps> = (props) => {
  const { delegatedTaskStore } = useStores();

  useEffect(() => {delegatedTaskStore.loadPendingTasks()}, [delegatedTaskStore.displayPendingTaskNotifier]);

  // if (delegatedTaskStore.loadingInitial)
  //   return <LoaderComponent content="Loading..." />;
  return (
    <Fragment>
      {delegatedTaskStore.pendingTasksNotifier && (
        <Fragment>
          <MinorHeader
            as="h3"
            content="Pending tasks"
            className={props.className}
            function={delegatedTaskStore.displayPendingTaskNotifier}
          />
          <Segment basic className="task-notifier">
            {delegatedTaskStore.pendingTasksByDate.map((task) => (
              <Fragment key={task.id}>
                <TaskNotification task={task} />
              </Fragment>
            ))}
            {props.taskCount == 0 && (
              <Card raised={true} className="empty">
                <Card.Content>
                  <Card.Header>You have no pending tasks. </Card.Header>
                </Card.Content>
              </Card>
            )}
          </Segment>
        </Fragment>
      )}
    </Fragment>
  );
};

export default observer(TaskNotifier);
