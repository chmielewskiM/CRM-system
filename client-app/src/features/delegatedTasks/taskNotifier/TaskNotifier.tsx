import React, { Fragment, useContext, useEffect } from 'react';
import { Header, Divider, Label, Segment, Button, Container, Pagination } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import LoaderComponent from '../../../app/layout/LoaderComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { TaskNotification } from './TaskNotification';

export const TaskNotifier: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadingInitial,
    rr,
    notes,
    displayDimmer
  } = rootStore.delegatedTaskStore;

  useEffect(() => {}, [rr]);

  if (loadingInitial) return <LoaderComponent content="Loading..." />;
  return (
    <Segment basic className='task-notifier'>
      <div className='shutter'>
      <Fragment>
        {/* <Header as="h2" width={16}>
          {selectedContact!.name}
        </Header> */}
        {/* <Container> */}

        <TaskNotification notes={notes} key='1'/>
        <TaskNotification notes={notes} key='2'/>
        <TaskNotification notes={notes} key='3'/>
        <TaskNotification notes={notes} key='4'/>
        <TaskNotification notes={notes} key='5'/>



        {/* </Container> */}
      </Fragment>
      </div>
    </Segment>
  );
};

export default observer(TaskNotifier);
