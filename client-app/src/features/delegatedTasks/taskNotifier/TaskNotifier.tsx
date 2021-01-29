import React, { Fragment, useContext, useEffect } from 'react';
import { Header, Divider, Label, Segment, Button, Container, Pagination } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import LoaderComponent from '../../../app/layout/LoaderComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { TaskNotification } from './TaskNotification';

export const TaskNotifier: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { loadingInitial, rr, notes, displayDimmer, receivedTasksByDate } = rootStore.delegatedTaskStore;

  useEffect(() => {}, [rr]);

  if (loadingInitial) return <LoaderComponent content="Loading..." />;
  return (
    <Segment basic className="task-notifier">
      <div className="shutter">
        
          {/* <Header as="h2" width={16}>
          {selectedContact!.name}
        </Header> */}
          {/* <Container> */}
          {receivedTasksByDate.map((task) => (
            <Fragment key={task.id}>
          <TaskNotification task={task} />
          </Fragment>
          ))}
          {/* </Container> */}
        
      </div>
    </Segment>
  );
};

export default observer(TaskNotifier);
