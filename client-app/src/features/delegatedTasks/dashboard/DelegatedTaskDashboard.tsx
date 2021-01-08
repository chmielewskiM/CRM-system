import React, { useContext, useEffect } from 'react';
import { Grid, Button, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { DelegatedTaskList } from './DelegatedTaskList';
import { DelegatedTaskForm } from '../form/DelegatedTaskForm';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { TaskNotifier } from '../taskNotifier/TaskNotifier';
import { DelegatedTaskDetails } from '../details/DelegatedTaskDetails';
import ArchivedLog from '../../archivedLogs/ArchivedLog';

export const DelegatedTaskDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadDelegatedTasks,
    showDelegatedTaskForm,
    selectedDelegatedTask,
    addDelegatedTaskForm,
    editDelegatedTaskForm,
    deleteDelegatedTask,
    loadUsers,
    displayDimmer,
  } = rootStore.delegatedTaskStore;
  useEffect(() => {
    loadDelegatedTasks();
  }, [rootStore.delegatedTaskStore]);

  // if (delegatedTaskStore.loadingInitial)
  //   return <LoaderComponent content="Loading..." />;

  return (
    <Grid stackable centered divided="vertically" className="main-grid">
      {showDelegatedTaskForm && (
        <DelegatedTaskForm
          key={(selectedDelegatedTask && selectedDelegatedTask.id) || 0}
          delegatedTask={selectedDelegatedTask!}
        />
      )}
      <Grid.Row className="buttons-row">
        <Button positive content="Add task" icon="plus" onClick={addDelegatedTaskForm} />
        <Button content="Done tasks" icon="history" />
        {selectedDelegatedTask && (
          <Button
            icon="pencil alternate"
            content="Edit task"
            onClick={() => editDelegatedTaskForm(selectedDelegatedTask.id!)}
          />
        )}
        {selectedDelegatedTask && (
          <Button icon="eraser" content="Delete task" onClick={() => deleteDelegatedTask(selectedDelegatedTask.id!)} />
        )}
        {selectedDelegatedTask && (
          <Button
            content="Mark as done"
            // onClick={() => deleteDelegatedTask(selectedDelegatedTask.id!)}
          />
        )}
      </Grid.Row>
      <Grid.Row className="row-content-1" stretched={true}>
        <Grid.Column width={12}>
          <DelegatedTaskList />
        </Grid.Column>
        <Grid.Column width={4}>
          <TaskNotifier />
        </Grid.Column>
      </Grid.Row>

      <Grid.Row className="row-content-2" stretched={true}>
        <Grid.Column width={8}>{selectedDelegatedTask !== undefined && <DelegatedTaskDetails />}</Grid.Column>
        <Grid.Column width={6}>
          <Segment basic className="task log">
            {' '}
            <ArchivedLog showAll={true} />{' '}
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default observer(DelegatedTaskDashboard);
