import React, { useContext } from 'react';
import { Table, Item, Icon, Button, Header } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/stores/rootStore';

interface IProps {
  // filling:{
  //   header: string,
  //   meta: Array<string>
  // };
  showAll: boolean;
}

export const ArchivedLog: React.FC<IProps> = (props) => {
  const rootStore = useContext(RootStoreContext);
  const { contactsByDate, selectContact } = rootStore.contactStore;

  return (
    <>
      <Header>
        <span>History</span>
        <Button.Group basic className="logs-button-group">
          <Button as="a" size="small" active={false} compact content="All" />
          {props.showAll && <Button as="a" size="small" active={false} compact content="Button2" />}
        </Button.Group>
      </Header>

      <Item>
        <Icon name="checkmark" color="green" />
        <Item.Content>
          <Item.Header>Created by: John</Item.Header>
          <Item.Meta>
            <span>Began: </span>
            <span>Done: </span>
          </Item.Meta>
          <Button circular icon="info"></Button>
        </Item.Content>
      </Item>
      <Item>
        <Icon name="checkmark" color="green" />
        <Item.Content>
          <Item.Header>Created by: George</Item.Header>
          <Item.Meta>
            <span>Began: </span>
            <span>Done: </span>
          </Item.Meta>
          <Button circular icon="info"></Button>
        </Item.Content>
      </Item>

      <Item>
        <Icon name="checkmark" color="green" />
        <Item.Content>
          <Item.Header>Created by: Michael </Item.Header>
          <Item.Meta>
            <span>Began: </span>
            <span>Done: </span>
          </Item.Meta>
          <Button circular icon="info"></Button>
        </Item.Content>
      </Item>
    </>
  );
};

export default observer(ArchivedLog);
