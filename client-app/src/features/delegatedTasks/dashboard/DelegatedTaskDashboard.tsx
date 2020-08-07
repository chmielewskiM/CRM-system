import React, { useContext, useEffect } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { ToastContainer, Zoom } from 'react-toastify';
import { DelegatedTaskList } from './DelegatedTaskList';
// import { DelegatedTaskDetails } from '../details/DelegatedTaskDetails';
import { DelegatedTaskForm } from '../form/DelegatedTaskForm';
import DelegatedTaskStore from '../../../app/stores/delegatedTaskStore';
import LoaderComponent from '../../../app/layout/LoaderComponent';

export const DelegatedTaskDashboard: React.FC = () => {
  const delegatedTaskStore = useContext(DelegatedTaskStore);
  const {
    showDelegatedTaskForm,
    selectedDelegatedTask,
    addDelegatedTaskForm,
    editDelegatedTaskForm,
    deleteDelegatedTask
  } = delegatedTaskStore;
  useEffect(() => {
    delegatedTaskStore.loadDelegatedTasks();
  }, [delegatedTaskStore]);

  // if (delegatedTaskStore.loadingInitial)
  //   return <LoaderComponent content="Loading..." />;

  return (
    <Grid stackable centered divided="vertically">
      {showDelegatedTaskForm && (
        <DelegatedTaskForm
          key={(selectedDelegatedTask && selectedDelegatedTask.id) || 0}
          delegatedTask={selectedDelegatedTask!}
        />
      )}
      <Grid.Row>
        <Grid.Column width={2}>
          <Button positive content="Add task" onClick={addDelegatedTaskForm} />
          <Button content="Done tasks" />
          {selectedDelegatedTask && (
            <Button
              content="Edit task"
              color="blue"
              onClick={() => editDelegatedTaskForm(selectedDelegatedTask.id!)}
            />
          )}
          {selectedDelegatedTask && (
            <Button
              negative
              content="Delete task"
              onClick={() => deleteDelegatedTask(selectedDelegatedTask.id!)}
            />
          )}
          {selectedDelegatedTask && (
            <Button
              negative
              content="Mark as done"
              // onClick={() => deleteDelegatedTask(selectedDelegatedTask.id!)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={10}>
          <DelegatedTaskList />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={6}>
        <Grid.Column width={6}>
          {/* {selectedDelegatedTask !== undefined && <DelegatedTaskDetails />} */}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default observer(DelegatedTaskDashboard);
