import React, { useContext, useEffect, ReactNode, Children } from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import { RootStoreContext } from '../../stores/rootStore';
import { observer } from 'mobx-react-lite';
import { IContact } from '../../models/contact';

interface IProps {
  body: string;
  open:boolean;
  // node: ReactNode;
}
export const InfoModal: React.FC<IProps> = (props) => {
  const rootStore = useContext(RootStoreContext);
  const {
    closeModal,
    confirmModal,
    modal,
    openModal,
    rr
  } = rootStore.modalStore;
  // const { selectedOrder, closeOrder } = rootStore.homeStore;
  useEffect(() => {}, [rr]);
  const b = document.getElementById('rbc');
  const c =b?.lastChild;
  console.log(c)
  return (
    <Modal  dimmer='blurring' open={modal.open}  size="mini" mountNode={c}>
      {/* <Header></Header> */}
      <Icon as={Button} icon='x' onClick={closeModal} floated='right' ></Icon>
      <Modal.Content>
        <Modal.Header>Name</Modal.Header>
        <Modal.Description content={modal.body}></Modal.Description>
      </Modal.Content>
    </Modal>
  );
};

export default observer(InfoModal);
