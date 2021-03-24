import React, { useContext, useEffect, Fragment } from 'react';
import { Table, Segment, Grid, Button, Label, Icon } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { format } from 'date-fns';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { filterSharedTasksButtons } from '../../../app/common/options/buttons';
import { destructureDate } from '../../../app/common/util/util';
import { IDelegatedTask } from '../../../app/models/delegatedTask';
import { IUser } from '../../../app/models/user';
import LoaderComponent from '../../../app/layout/LoaderComponent';

interface IProps {
  user: IUser | null;
}

export const DelegatedTaskList: React.FC<IProps> = (props) => {
  const rootStore = useContext(RootStoreContext);
  const {
    activeTasksByDate,
    selectTask,
    selectedTask,
    setTaskList,
    myTasks,
    editTaskForm,
    deleteTask,
    setShowShareTaskForm,
    submitting,
    rr,
  } = rootStore.delegatedTaskStore;

  useEffect(() => {
    setTaskList('myTasks');
  }, []);
  if (submitting) return <LoaderComponent content="Loading..." />;
  return (
    <Fragment>
      <Segment basic as={Grid.Column} className="task list">
        <Table
          striped
          selectable
          size="small"
          className="table-container task-list"
          scrollable="true"
        >
          <Table.Header className="head">
            <Table.Row>
              {!myTasks && <Table.HeaderCell>Shared by</Table.HeaderCell>}

              <Table.HeaderCell>Task</Table.HeaderCell>
              <Table.HeaderCell>Deadline</Table.HeaderCell>
              <Table.HeaderCell className="notes-cell-header">Notes</Table.HeaderCell>
              <Table.HeaderCell>Shared with</Table.HeaderCell>
              {/* {myTasks && <Table.HeaderCell></Table.HeaderCell>} */}
            </Table.Row>
          </Table.Header>
          {activeTasksByDate.map((task: IDelegatedTask) => (
            <Table.Body key={task.id}>
              {!(myTasks && task.sharedWith == props.user) && (
                <Table.Row
                  onClick={() => {
                    selectTask(task.id);
                  }}
                  active={selectedTask !== undefined && selectedTask.id == task.id}
                >
                  {/* <Table.Cell>{Object.values(task.userAccess)}</Table.Cell> */}
                  {!myTasks && <Table.Cell>{task.access.createdByUsername}</Table.Cell>}

                  <Table.Cell>{task.type}</Table.Cell>
                  <Table.Cell>{destructureDate(new Date(task.deadline))}</Table.Cell>
                  <Table.Cell className="notes-cell">{task.notes}</Table.Cell>
                  <Table.Cell className="shared-with-cell control-icons">
                    {task.access.sharedWithUsername}
                    {task.pending && <Icon className='status' name="refresh" />}
                    {(task.accepted || task.done) && <Icon className='status' name="check" />}
                    {task.refused && <Icon className='status' name="ban" />}
                    {
                    // <Table.Cell className="control-icons">
                     myTasks && (<Fragment> <Button as="i" icon="eraser" onClick={() => deleteTask(task.id)} />
                      <Button as="i" icon="pencil" onClick={() => editTaskForm(task.id!)} />

                      {(task.refused ||
                        (!task.access.sharedWithUsername && props.user?.level != 'low')) && (
                        <Button
                          as="i"
                          icon="share square"
                          onClick={() => setShowShareTaskForm(true, task)}
                        />
                      )}
                      {task.access.sharedWithUsername &&
                        !task.refused &&
                        props.user?.level != 'low' && (
                          <Button as="i" icon="share square" disabled />
                        )}
                    {/* // </Table.Cell> */}
                    </Fragment>
                  )}
                    {/* {task.done && <Icon name="check" />} */}
                  </Table.Cell>
                  
                </Table.Row>
              )}
            </Table.Body>
          ))}
        </Table>
      </Segment>
    </Fragment>
  );
};

export default observer(DelegatedTaskList);
