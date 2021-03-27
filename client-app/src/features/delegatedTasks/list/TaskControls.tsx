import React, { Fragment, useContext, useEffect } from 'react';
import { Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { IDelegatedTask } from '../../../app/models/delegatedTask';
import { IUser } from '../../../app/models/user';

interface IProps {
  task: IDelegatedTask;
  user: IUser;
}

export const TaskControls: React.FC<IProps> = (props) => {
  const rootStore = useContext(RootStoreContext);

  const {
    submitting,
    deleteTask,
    editTaskForm,
    setShowShareTaskForm,
    rr,
  } = rootStore.delegatedTaskStore;
  useEffect(() => {}, [rr]);

  return (
    <Fragment>
      <Button as="i" icon="eraser" onClick={() => deleteTask(props.task.id)} />
      <Button
        as="i"
        icon="pencil"
        onClick={() => editTaskForm(props.task.id!)}
      />

      {(props.task.refused ||
        (!props.task.access.sharedWithUsername &&
          props.user.level != 'low')) && (
        <Button
          as="i"
          icon="share square"
          onClick={() => setShowShareTaskForm(true, props.task)}
        />
      )}
      {props.task.access.sharedWithUsername &&
        !props.task.refused &&
        props.user.level != 'low' && (
          <Button as="i" icon="share square" disabled />
        )}
      {/* // </Table.Cell> */}
    </Fragment>
  );
};
export default observer(TaskControls);
