import React, { useContext, useEffect, ReactNode, Children, Fragment } from 'react';
import { Button, Header, Icon, Modal, Segment, HeaderProps } from 'semantic-ui-react';
import { RootStoreContext } from '../../stores/rootStore';
import { observer } from 'mobx-react-lite';
import { IContact } from '../../models/contact';
import ContactControls from '../../../features/contacts/list/ContactControls';

interface IProps extends HeaderProps {
    function?: (() => void) | undefined;
    controls?: boolean;
    contact?:IContact;
}

export const MinorHeader: React.FC<IProps> = (props) => {
  return (
    <Segment attached="top" className={'minor-header ' + props.className}>
      <Header as={props.as} content={props.content}/>
      {props.controls && <div className='control-icons mobile'><ContactControls contact={props.contact!}/></div>}
      {props.function && <Button
          icon="close"
          onClick={props.function}
        />}
    </Segment>
  );
};

export default observer(MinorHeader);
