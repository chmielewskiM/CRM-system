import React, { useEffect, Fragment } from 'react';
import { Table, Icon } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../app/stores/rootStore';
import { destructureDate } from '../../../app/common/util/util';
import { IDelegatedTask } from '../../../app/models/delegatedTask';
import { IUser } from '../../../app/models/user';
import LoaderComponent from '../../../app/layout/LoaderComponent';
import { TaskControls } from './TaskControls';

interface IProps {
  user: IUser | null;
}

export const DelegatedTaskList: React.FC<IProps> = (props) => {
  const { delegatedTaskStore } = useStores();

  useEffect(() => {}, []);

  if (delegatedTaskStore.submitting)
    return <LoaderComponent content="Loading..." />;

  return (
    <Fragment>
      <Table
        striped
        selectable
        size="small"
        className="table-container task-list"
        scrollable="true"
      >
        <Table.Header className="head">
          <Table.Row>
            {!delegatedTaskStore.myTasks && (
              <Table.HeaderCell>Shared by</Table.HeaderCell>
            )}

            <Table.HeaderCell>Task</Table.HeaderCell>
            <Table.HeaderCell>Deadline</Table.HeaderCell>
            <Table.HeaderCell className="notes-cell-header">
              Notes
            </Table.HeaderCell>
            {delegatedTaskStore.myTasks && delegatedTaskStore.sharedTasks && (
              <Table.HeaderCell>Shared with</Table.HeaderCell>
            )}
            {!delegatedTaskStore.myTasks && delegatedTaskStore.sharedTasks && (
              <Table.HeaderCell>Status</Table.HeaderCell>
            )}
            {delegatedTaskStore.myTasks && (
              <Table.HeaderCell className="control-icons"></Table.HeaderCell>
            )}
          </Table.Row>
        </Table.Header>
        {delegatedTaskStore.activeTasksByDate.map((task: IDelegatedTask) => (
          <Table.Body key={task.id}>
            {!(
              delegatedTaskStore.myTasks &&
              task.access.sharedWithUsername == props.user?.username
            ) && (
              <Table.Row
                onClick={() => {
                  delegatedTaskStore.selectTask(task.id);
                }}
                active={
                  delegatedTaskStore.selectedTask !== undefined &&
                  delegatedTaskStore.selectedTask.id == task.id
                }
              >
                {!delegatedTaskStore.myTasks && (
                  <Table.Cell>{task.access.createdByUsername}</Table.Cell>
                )}

                <Table.Cell>{task.type}</Table.Cell>
                <Table.Cell>
                  {destructureDate(new Date(task.deadline))}
                </Table.Cell>
                <Table.Cell className="notes-cell">{task.notes}</Table.Cell>
                {delegatedTaskStore.sharedTasks && (
                  <Table.Cell className="shared-with-cell">
                    {delegatedTaskStore.myTasks &&
                      task.access.sharedWithUsername}
                    {task.pending && <Icon className="status" name="refresh" />}
                    {(task.accepted || task.done) && (
                      <Icon className="status" name="check" />
                    )}
                    {task.refused && <Icon className="status" name="ban" />}
                    {/* {delegatedTaskStore.myTasks && (
                    <TaskControls task={task} user={props.user!} />
                  )} */}
                  </Table.Cell>
                )}
                {delegatedTaskStore.myTasks && (
                  <Table.Cell className="control-icons">
                    <TaskControls task={task} />
                  </Table.Cell>
                )}
              </Table.Row>
            )}
          </Table.Body>
        ))}
      </Table>
    </Fragment>
  );
};

export default observer(DelegatedTaskList);
