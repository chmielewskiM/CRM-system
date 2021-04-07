import React from 'react';
import { Button, Header, Segment, HeaderProps } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { IContact } from '../../models/contact';
import ContactControls from '../../../features/contacts/list/ContactControls';
import TaskControls from '../../../features/delegatedTasks/list/TaskControls';
import { IDelegatedTask } from '../../models/delegatedTask';
import { IUser } from '../../models/user';

interface IProps extends HeaderProps {
  function?: (() => void) | undefined;
  contactControls?: boolean;
  taskControls?: boolean;
  contact?: IContact;
  task?: IDelegatedTask;
}

export const MinorHeader: React.FC<IProps> = (props) => {
  return (
    <Segment attached="top" className={'minor-header ' + props.className}>
      <Header as={props.as} content={props.content} />
      {props.contactControls && (
        <div className="control-icons mobile">
          <ContactControls contact={props.contact!} />
        </div>
      )}
      {props.taskControls && (
        <div className="control-icons mobile">
          <TaskControls task={props.task!}/>
        </div>
      )}
      {props.function && <Button icon="close" onClick={props.function} />}
    </Segment>
  );
};

export default observer(MinorHeader);
