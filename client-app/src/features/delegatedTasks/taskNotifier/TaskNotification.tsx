import React, { useEffect, Attributes } from 'react';
import { Button, Card } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import LoaderComponent from '../../../app/layout/LoaderComponent';
import { useStores } from '../../../app/stores/rootStore';
import { IDelegatedTask } from '../../../app/models/delegatedTask';
import { destructureDate } from '../../../app/common/util/util';

interface IProps extends Attributes {
  task: IDelegatedTask;
}

export const TaskNotification: React.FC<IProps> = (props) => {
  const { delegatedTaskStore } = useStores();

  useEffect(() => {}, [delegatedTaskStore.pendingTasksCount]);

  // if (delegatedTaskStore.loadingInitial)
  //   return <LoaderComponent content="Loading..." />;
  return (
    <Card raised={true}>
      <Card.Content key={props.task.id}>
        <Card.Header>From: {props.task.access.createdBy} </Card.Header>
        <Card.Meta>{props.task.type}</Card.Meta>
        <Card.Meta>
          Deadline: {destructureDate(new Date(props.task.deadline))}
        </Card.Meta>
        <Button.Group>
          <Button
            basic
            bordered="false"
            icon="cancel"
            onClick={() => delegatedTaskStore.refuseTask(props.task)}
          />
          <Button
            basic
            bordered="false"
            icon="check"
            onClick={() => delegatedTaskStore.acceptTask(props.task)}
          />
        </Button.Group>
        <Button
          bordered="false"
          icon="info"
          className="info-btn"
          onClick={() => delegatedTaskStore.selectTask(props.task.id)}
        />
      </Card.Content>
    </Card>
  );
};

export default observer(TaskNotification);
