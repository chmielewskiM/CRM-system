import React, { useContext, useEffect, ReactNode, Children, Fragment } from 'react';
import { Button, Header, Icon, Modal, Segment, HeaderProps } from 'semantic-ui-react';
import { RootStoreContext } from '../../stores/rootStore';
import { observer } from 'mobx-react-lite';
import { IContact } from '../../models/contact';

interface IProps extends HeaderProps {
    function?: (() => void) | undefined;
    // show?: boolean;
}

export const MinorHeader: React.FC<IProps> = (props) => {
  return (
    <Segment attached="top" className={'minor-header ' + props.className}>
      <Header as={props.as} content={props.content}/>
      {props.function && <Button
          icon="close"
          onClick={props.function}
        />}
    </Segment>
  );
};

export default observer(MinorHeader);
