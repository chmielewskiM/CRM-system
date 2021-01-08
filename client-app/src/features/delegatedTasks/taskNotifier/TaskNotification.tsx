import React, { useContext, useEffect } from 'react';
import { Button, Card, Dimmer } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import LoaderComponent from '../../../app/layout/LoaderComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { IDelegatedTask } from '../../../app/models/delegatedTask';
import { IContact } from '../../../app/models/contact';

interface IProps {
  // task: IDelegatedTask;
  // contact: IContact | undefined;
  notes: string | undefined;
}

export const TaskNotification: React.FC<IProps> = (props) => {
  const rootStore = useContext(RootStoreContext);
  const { loadingInitial, submitting, showDimmer, hideDimmer, displayDimmer, rr } = rootStore.delegatedTaskStore;

  useEffect(() => {
    console.log('rend');
  }, []);

  if (loadingInitial) return <LoaderComponent content="Loading..." />;
  return (
    <Dimmer.Dimmable dimmed={displayDimmer} onMouseEnter={showDimmer} onMouseLeave={hideDimmer} size="medium">
      <Card raised={true}>
        <Dimmer active={displayDimmer}></Dimmer>
        <Card.Content>
          <Card.Header>From:</Card.Header>
          <Card.Meta>Sent:</Card.Meta>
          <Card.Meta>Deadline:</Card.Meta>
          <Card.Meta>Priority:</Card.Meta>
          <Card.Meta></Card.Meta>
          <Button.Group>
            <Button basic bordered="false" icon="cancel" />
            <Button basic bordered="false" icon="check" />
          </Button.Group>
        </Card.Content>
      </Card>
    </Dimmer.Dimmable>
  );
};

export default observer(TaskNotification);
