import React, { useContext, useEffect } from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import { RootStoreContext } from '../../stores/rootStore';
import { observer } from 'mobx-react-lite';
import { IContact } from '../../models/contact';
import { DelegatedTaskFormValues, IDelegatedTask } from '../../models/delegatedTask';

interface IProps {
  contact: IContact | undefined;
  task: IDelegatedTask | undefined;
  function(contact:IContact):void;
}
export const ConfirmationModal: React.FC<IProps> = (props) => {
  const rootStore = useContext(RootStoreContext);
  const {
    modal: { open, body },
    closeModal,
    confirmModal,
    modal,
    rr,
  } = rootStore.modalStore;
  useEffect(() => {}, [rr]);

  return (
    <Modal basic open={open} size="small">
      <Header icon></Header>
      <Modal.Content content={modal.body}></Modal.Content>
      <Modal.Actions>
        <Button basic color="red" inverted onClick={() => closeModal()}>
          <Icon name="remove" /> No
        </Button>
        {/* <Button color="green" inverted onClick={() => confirmModal(props.contact)}> */}
        <Button color="green" inverted onClick={() => props.function(props.contact!)}>
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default observer(ConfirmationModal);
