import React, { useContext, useEffect } from 'react';
import { Grid, Button, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { DelegatedTaskList } from './DelegatedTaskList';
import { DelegatedTaskForm } from '../form/DelegatedTaskForm';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { TaskNotifier } from '../taskNotifier/TaskNotifier';
import { DelegatedTaskDetails } from '../details/DelegatedTaskDetails';
import ArchivedLog from '../../archivedLogs/ArchivedLog';
import ShareTaskForm from '../form/ShareTaskForm';

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
    setShowShareTaskForm,
    showShareTaskForm,
    calendarEvents,
    rr
  } = rootStore.delegatedTaskStore;

  useEffect(() => {
    loadDelegatedTasks();
    calendarEvents;
    console.log('TASK DASH')
  }, [showShareTaskForm]);

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
      {showShareTaskForm && <ShareTaskForm delegatedTask={selectedDelegatedTask} />}
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
          <Button
            icon="eraser"
            content="Delete task"
            onClick={() => deleteDelegatedTask(selectedDelegatedTask.id!)}
          />
        )}
        {selectedDelegatedTask && (
          <Button icon="check" content="Mark as done" onClick={() => console.log(calendarEvents)} />
        )}
        {selectedDelegatedTask && (rootStore.userStore.topAccess || rootStore.userStore.midAccess) && (
          <Button
            // icon =
            content="Share"
            onClick={() => setShowShareTaskForm(true)}
          />
        )}

        <Button
          icon="angle down"
          className="expand-menu"
          onClick={(event) => rootStore.commonStore.expandMenu(event)}
        />
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
        <Grid.Column width={6}>
          {selectedDelegatedTask !== undefined && <DelegatedTaskDetails />}
        </Grid.Column>
        <Grid.Column width={6}>
          <Segment basic className="task log">
            {' '}
            <ArchivedLog
              showAll={true}
              // filling={{
              //   header: task.createdBy,
              //   dateOne: task.dateStarted,
              //   dateTwo: task.deadline,
              //   done: task.done,
              //   info: task.notes,
              // }}
              list={rootStore.delegatedTaskStore.userClosedTasks}
            />
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default observer(DelegatedTaskDashboard);
