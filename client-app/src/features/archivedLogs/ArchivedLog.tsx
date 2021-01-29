import React, { useContext, Fragment } from 'react';
import { Table, Item, Icon, Button, Header } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/stores/rootStore';
import { destructureDeadline, destructureDate } from '../../app/common/util/util';

interface IProps {
  // filling: {
  //   header?: string;
  //   dateOne?: Date;
  //   dateTwo?: Date;
  //   done?: boolean;
  //   info?: string;
  // };
  showAll: boolean;
  list: any[];
}

export const ArchivedLog: React.FC<IProps> = (props) => {
  const rootStore = useContext(RootStoreContext);
  const { contactsByDate, selectContact } = rootStore.contactStore;

  return (
    <Fragment>
      <Header>
        <span>History</span>
        <Button.Group basic className="logs-button-group">
          <Button as="a" size="small" active={false} compact content="All" />
          {props.showAll && <Button as="a" size="small" active={false} compact content="Button2" />}
        </Button.Group>
      </Header>
      {props.list.map((task) => (
        <Fragment key={task.id}>
          <Item>
            {task.done && <Icon name="checkmark" color="green" />}
            {!task.done && <Icon name="x" color="red" />}
            <Item.Content>
              <Item.Header>Created by: {task.createdBy}</Item.Header>
              <Item.Meta>
                <span>Began: {destructureDate(task.dateStarted)}</span>
                <span>Done: {destructureDeadline(task.deadline)}</span>
              </Item.Meta>
              <Button circular icon="info"></Button>
            </Item.Content>
          </Item>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default observer(ArchivedLog);
