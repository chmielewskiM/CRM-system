import React, { Fragment, useEffect } from 'react';
import { Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../app/stores/rootStore';
import { IDelegatedTask } from '../../../app/models/delegatedTask';
import { IUser } from '../../../app/models/user';

interface IProps {
  task: IDelegatedTask;
  user: IUser;
}

export const TaskControls: React.FC<IProps> = (props) => {
  const { delegatedTaskStore, userStore } = useStores();

  useEffect(() => {}, []);

  return (
    <Fragment>
      <Button
        as="i"
        icon="eraser"
        onClick={() => delegatedTaskStore.deleteTask(props.task.id)}
      />
      <Button
        as="i"
        icon="pencil"
        onClick={() => delegatedTaskStore.editTaskForm(props.task.id!)}
      />
      {(props.task.refused ||
        (!props.task.access.sharedWithUsername &&
          userStore.user?.level != 'low')) && (
        <Button
          as="i"
          icon="share square"
          onClick={() =>
            delegatedTaskStore.setShowShareTaskForm(true, props.task)
          }
        />
      )}
      {props.task.access.sharedWithUsername &&
        !props.task.refused &&
        userStore.user?.level != 'low' && (
          <Button as="i" icon="share square" disabled />
        )}
    </Fragment>
  );
};
export default observer(TaskControls);
