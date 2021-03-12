import React, { useContext, useEffect, useState } from 'react';
import { Grid, Button, Segment, Label, Icon } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { DelegatedTaskList } from '../list/DelegatedTaskList';
import { DelegatedTaskForm } from '../form/DelegatedTaskForm';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { TaskNotifier } from '../taskNotifier/TaskNotifier';
import { DelegatedTaskDetails } from '../details/DelegatedTaskDetails';
import ShareTaskForm from '../form/ShareTaskForm';
import { filterTasksButtons, filterSharedTasksButtons } from '../../../app/common/options/buttons';
import LoaderComponent from '../../../app/layout/LoaderComponent';

export const DelegatedTaskDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);

  const {
    loadingInitial,
    showDelegatedTaskForm,
    selectedTask,
    addDelegatedTaskForm,
    setTaskList,
    showShareTaskForm,
    pendingTasksCount,
    pendingTasksNotifier,
    displayPendingTaskNotifier,
    myTasks,
    finishTask,
    rr,
  } = rootStore.delegatedTaskStore;
  const { user } = rootStore.userStore;
  useEffect(() => {
    console.log('TASK DASH');
  }, [rr]);

  // if (loadingInitial) return <LoaderComponent content="Loading..." />;
  return (
    <Grid stackable centered className="main-grid">
      {showDelegatedTaskForm && (
        <DelegatedTaskForm
          className={'task-form'}
          key={(selectedTask && selectedTask.id) || 0}
          delegatedTask={selectedTask!}
        />
      )}
      {showShareTaskForm && <ShareTaskForm delegatedTask={selectedTask} />}
      <Grid.Row className="topbar">
        <Button positive content="Add task" icon="plus" onClick={addDelegatedTaskForm} />
        {selectedTask && myTasks && (
          <Button icon="check" content="Mark as done" onClick={() => finishTask(selectedTask)} />
        )}
        <Button className="pendingBtn" onClick={displayPendingTaskNotifier}>
          
          <div><Icon name="wait" />Pending<div className='count'><span>{pendingTasksCount}</span></div></div>
        </Button>
        <Button
          icon="angle down"
          className="expand-menu"
          onClick={(event) => rootStore.commonStore.expandMenu(event)}
        />
      </Grid.Row>
      <Grid.Row className="row-content-1 tasks" stretched={true}>
        <Grid.Column className="list-col">
          <Segment attached="top" floated="right" className="filter-buttons">
            <Button.Group floated="left">
              <Label basic content="Filter tasks:" />
              {filterTasksButtons.map((button) => (
                <Button
                  key={button.key}
                  as={button.as}
                  content={button.content}
                  size={button.size}
                  compact={button.compact}
                  className={button.className}
                  onClick={(e) => setTaskList(button.functionArg, e.currentTarget)}
                />
              ))}
            </Button.Group>
            {!myTasks && (
              <Button.Group floated="left">
                {filterSharedTasksButtons.map((button) => (
                  <Button
                    key={button.key}
                    as={button.as}
                    content={button.content}
                    size={button.size}
                    compact={button.compact}
                    className={button.className}
                    onClick={(e) => setTaskList(button.functionArg, e.currentTarget)}
                  />
                ))}
              </Button.Group>
            )}
          </Segment>
          <DelegatedTaskList user={user} />
        </Grid.Column>
        {pendingTasksNotifier && (
          <Grid.Column width={4} className="notifier-col">
            <TaskNotifier className="notifier" taskCount={pendingTasksCount}/>
          </Grid.Column>
        )}
      </Grid.Row>

      <Grid.Row className="row-content-2" stretched={true}>
        <Grid.Column computer={7} tablet={10} className="details-col">
          {selectedTask !== undefined && <DelegatedTaskDetails />}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default observer(DelegatedTaskDashboard);
