import React, { useContext, useEffect, Attributes } from 'react';
import { Button, Card, Dimmer } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import LoaderComponent from '../../../app/layout/LoaderComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { IDelegatedTask } from '../../../app/models/delegatedTask';
import { IContact } from '../../../app/models/contact';

interface IProps extends Attributes{
  task: IDelegatedTask;
  
  // contact: IContact | undefined;
  // notes: string | undefined;
}

export const TaskNotification: React.FC<IProps> = (props) => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadingInitial,
    submitting,
    showDimmer,
    hideDimmer,
    displayDimmer,
    rr,
  } = rootStore.delegatedTaskStore;

  useEffect(() => {
    console.log('TASK NOTIFICATION')
  }, [rr]);

  if (loadingInitial) return <LoaderComponent content="Loading..." />;
  return (
    // <Dimmer.Dimmable
    //   dimmed={displayDimmer}
    //   onMouseEnter={showDimmer}
    //   onMouseLeave={hideDimmer}
    //   size="medium"
    // >
      <Card raised={true}>
        <Dimmer active={displayDimmer}></Dimmer>
        <Card.Content key={props.task.id}>
          <Card.Header>From: {props.task.createdBy} </Card.Header>
          <Card.Meta>{props.task.type}</Card.Meta>
          <Card.Meta>Deadline: {props.task.deadline.getDate()}</Card.Meta>
          <Card.Meta>Notes: {props.task.notes}</Card.Meta>
          <Card.Meta></Card.Meta>
          <Button.Group>
            <Button basic bordered="false" icon="cancel" />
            <Button basic bordered="false" icon="check" />
          </Button.Group>
        </Card.Content>
      </Card>
    // </Dimmer.Dimmable>
  );
};

export default observer(TaskNotification);
