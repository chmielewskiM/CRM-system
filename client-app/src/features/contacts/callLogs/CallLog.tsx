import React, { useContext } from 'react';
import { Table, Item, Icon, Button, Header, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';

interface IProps {
  // filling:{
  //   header: string,
  //   meta: Array<string>
  // };
  showAll: boolean;
}

export const CallLog: React.FC<IProps> = (props) => {
  const rootStore = useContext(RootStoreContext);
  const { contactsByDate, selectedContact } = rootStore.contactStore;

  return (
    <Segment className="call-log">
      <Header>
        <span>Calls</span>
        <Button.Group basic className="logs-button-group">
          <Button as="a" size="small" active={false} compact content="All" />
          {props.showAll && <Button as="a" size="small" active={false} compact content="Button2" />}
        </Button.Group>
      </Header>

      <Item>
        <Icon name="phone" color="green" />
        <Item.Content>
          <Item.Header>{selectedContact?.name}</Item.Header>
          <Item.Meta>
            <span>Date: </span>
          </Item.Meta>
          <Button circular icon="info"></Button>
        </Item.Content>
      </Item>
      <Item>
        <Icon name="phone" color="green" />
        <Item.Content>
          <Item.Header>{selectedContact?.name}</Item.Header>
          <Item.Meta>
            <span>Date: </span>
          </Item.Meta>
          <Button circular icon="info"></Button>
        </Item.Content>
      </Item>
      <Item>
        <Icon name="phone" color="green" />
        <Item.Content>
          <Item.Header>{selectedContact?.name}</Item.Header>
          <Item.Meta>
            <span>Date: </span>
          </Item.Meta>
          <Button circular icon="info"></Button>
        </Item.Content>
      </Item>
    </Segment>
  );
};

export default observer(CallLog);
