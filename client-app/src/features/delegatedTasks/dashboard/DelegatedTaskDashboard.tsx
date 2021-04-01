import React, { useEffect } from 'react';
import {
  Grid,
  Button,
  Segment,
  Label,
  Icon,
  Container,
} from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import DelegatedTaskList from '../list/DelegatedTaskList';
import DelegatedTaskForm from '../form/DelegatedTaskForm';
import { useStores } from '../../../app/stores/rootStore';
import TaskNotifier from '../taskNotifier/TaskNotifier';
import DelegatedTaskDetails from '../details/DelegatedTaskDetails';
import ShareTaskForm from '../form/ShareTaskForm';
import {
  filterTasksButtons,
  filterSharedTasksButtons,
} from '../../../app/common/options/buttons';

export const DelegatedTaskDashboard: React.FC = () => {
  const { delegatedTaskStore, userStore, commonStore } = useStores();

  useEffect(() => {}, [delegatedTaskStore.tasksCount]);

  return (
    <Grid stackable centered className="main-grid tasks">
      {delegatedTaskStore.showTaskForm && (
        <DelegatedTaskForm
          className={'task-form'}
          key={
            (delegatedTaskStore.selectedTask &&
              delegatedTaskStore.selectedTask.id) ||
            0
          }
          delegatedTask={delegatedTaskStore.selectedTask!}
        />
      )}
      {delegatedTaskStore.showShareTaskForm && (
        <ShareTaskForm delegatedTask={delegatedTaskStore.selectedTask} />
      )}
      <Grid.Row className="topbar">
        <Button
          positive
          content="Add task"
          icon="plus"
          onClick={delegatedTaskStore.addTaskForm}
        />
        {(delegatedTaskStore.selectedTask?.access.sharedWithUsername ==
          userStore.user?.username ||
          delegatedTaskStore.selectedTask?.access.createdByUsername ==
            userStore.user?.username) &&
          delegatedTaskStore.selectedTask?.accepted && (
            <Button
              icon="check"
              content="Mark as done"
              onClick={() =>
                delegatedTaskStore.finishTask(delegatedTaskStore.selectedTask!)
              }
            />
          )}
        <Button
          className="pendingBtn"
          onClick={delegatedTaskStore.displayPendingTaskNotifier}
        >
          <div>
            <Icon name="wait" />
            Pending
            <div className="count">
              <span>{delegatedTaskStore.pendingTasksCount}</span>
            </div>
          </div>
        </Button>
        <Button
          icon="angle down"
          className="expand-menu"
          onClick={(event) => commonStore.expandMenu(event)}
        />
      </Grid.Row>
      <Grid.Row className="row-content-1">
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
                onClick={(e) =>
                  delegatedTaskStore.setTaskList(
                    button.functionArg,
                    e.currentTarget
                  )
                }
              />
            ))}
          </Button.Group>
          {delegatedTaskStore.sharedTasks && (
            <Button.Group floated="left">
              {filterSharedTasksButtons.map((button) => (
                <Button
                  key={button.key}
                  as={button.as}
                  content={button.content}
                  size={button.size}
                  compact={button.compact}
                  className={button.className}
                  onClick={(e) =>
                    delegatedTaskStore.setTaskList(
                      button.functionArg,
                      e.currentTarget
                    )
                  }
                />
              ))}
            </Button.Group>
          )}
          <Button.Group className="pagination">
            <Button
              icon="chevron left"
              onClick={() => delegatedTaskStore.setPagination(-1)}
              disabled={delegatedTaskStore.activePage <= 0}
            />
            <span className="contacts-from">
              {delegatedTaskStore.activePage < 1 && '1'}
              {delegatedTaskStore.activePage >= 1 &&
                delegatedTaskStore.activePage.toString().concat('1')}
            </span>
            <span className="contacts-to">
              -{delegatedTaskStore.activePage + 1}0&nbsp;
            </span>
            <span className="contacts-all">
              {' '}
              /&nbsp;{delegatedTaskStore.tasksCount}
            </span>
            <Button
              icon="chevron right"
              onClick={() => delegatedTaskStore.setPagination(1)}
              disabled={
                delegatedTaskStore.activePage + 1 >=
                delegatedTaskStore.tasksCount / 10
              }
            />
          </Button.Group>
        </Segment>
        <Grid.Column className="list-col">
          <DelegatedTaskList user={userStore.user} />
        </Grid.Column>
        {delegatedTaskStore.pendingTasksNotifier && (
          <Grid.Column width={4} className="notifier-col">
            <Container>
              <TaskNotifier
                className="notifier"
                taskCount={delegatedTaskStore.pendingTasksCount}
              />
            </Container>
          </Grid.Column>
        )}
      </Grid.Row>
      <Grid.Row className="row-content-2">
        <Grid.Column computer={7} tablet={10} className="details-col">
          {delegatedTaskStore.selectedTask !== undefined && (
            <DelegatedTaskDetails />
          )}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default observer(DelegatedTaskDashboard);
