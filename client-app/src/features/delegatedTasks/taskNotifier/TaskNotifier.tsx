import React, { Fragment, useContext, useEffect, useState } from 'react';
import {
  Header,
  Divider,
  Label,
  Segment,
  Button,
  Container,
  Pagination,
  HeaderProps,
  Card,
} from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import LoaderComponent from '../../../app/layout/LoaderComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { TaskNotification } from './TaskNotification';
import { MinorHeader } from '../../../app/common/headers/MinorHeader';

interface IProps {
  className: string;
  taskCount: number;
}

export const TaskNotifier: React.FC<IProps> = (props) => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadingInitial,
    setTaskList,
    pendingTasksByDate,
    pendingTasksCount,
    pendingTasksNotifier,
    displayPendingTaskNotifier,
  } = rootStore.delegatedTaskStore;

  useEffect(() => {
    setTaskList('pendingTasks');
  }, [pendingTasksCount]);

  if (loadingInitial) return <LoaderComponent content="Loading..." />;
  return (
    <Fragment>
      {pendingTasksNotifier && (
        <Fragment>
          <MinorHeader
            as="h3"
            content="Pending tasks"
            className={props.className}
            function={displayPendingTaskNotifier}
          />
          <Segment basic className="task-notifier">
            {pendingTasksByDate.map((task) => (
              <Fragment key={task.id}>
                <TaskNotification task={task} />
              </Fragment>
            ))}
            {props.taskCount == 0 && (
              <Card raised={true} className='empty'>
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
