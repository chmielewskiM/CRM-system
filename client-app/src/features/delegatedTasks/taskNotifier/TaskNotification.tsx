import React, { useContext, useEffect, Attributes } from 'react';
import { Button, Card, Dimmer } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import LoaderComponent from '../../../app/layout/LoaderComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { IDelegatedTask } from '../../../app/models/delegatedTask';
import { IContact } from '../../../app/models/contact';
import { destructureDate } from '../../../app/common/util/util';

interface IProps extends Attributes {
  task: IDelegatedTask;
}

export const TaskNotification: React.FC<IProps> = (props) => {
  const rootStore = useContext(RootStoreContext);
  const { loadingInitial, selectTask, refuseTask, acceptTask } = rootStore.delegatedTaskStore;

  useEffect(() => {}, []);

  if (loadingInitial) return <LoaderComponent content="Loading..." />;
  return (
    <Card raised={true}>
      <Card.Content key={props.task.id}>
        <Card.Header>From: {props.task.access.createdBy} </Card.Header>
        <Card.Meta>{props.task.type}</Card.Meta>
        <Card.Meta>Deadline: {destructureDate(new Date(props.task.deadline))}</Card.Meta>
        <Button.Group>
          <Button basic bordered="false" icon="cancel" onClick={() => refuseTask(props.task)} />
          <Button basic bordered="false" icon="check" onClick={() => acceptTask(props.task)} />
        </Button.Group>
        <Button
          bordered="false"
          icon="info"
          className="info-btn"
          onClick={() => selectTask(props.task.id)}
        />
      </Card.Content>
    </Card>
  );
};

export default observer(TaskNotification);
