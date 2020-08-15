import React, { useContext, useEffect } from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import { RootStoreContext } from '../../stores/rootStore';
import { observer } from 'mobx-react-lite';

function ModalContainer() {
  const rootStore = useContext(RootStoreContext);
  const {
    modal: { open, body },
    closeModal,
    rr,
  } = rootStore.modalStore;
  const { selectedOrder, closeOrder } = rootStore.orderStore;
  useEffect(() => {
    console.log('MCONT');
  }, [rr]);
  return (
    <Modal basic open={open} onClose={closeModal} size="small">
      <Header icon></Header>
      <Modal.Content></Modal.Content>
      <Modal.Actions>
        <Button basic color="red" inverted onClick={() => closeModal()}>
          <Icon name="remove" /> No
        </Button>
        <Button
          color="green"
          inverted
          onClick={() => closeOrder(selectedOrder!)}
        >
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default observer(ModalContainer);
