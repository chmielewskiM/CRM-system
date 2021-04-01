import React, { useContext, useEffect, ReactNode, Children } from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import { useStores } from '../../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { destructureDate } from '../../../app/common/util/util';

interface IProps {
  event?: {
    start: Date;
    deadline: Date;
    title: string;
    allDay: boolean;
    createdBy: string;
    pending: boolean;
    notes: string;
  };
  body?: string;
  open: boolean;
}
export const CalendarModal: React.FC<IProps> = (props) => {
  const { modalStore, delegatedTaskStore } = useStores();

  useEffect(() => {}, []);

  const calendar = document.getElementById('rbc')?.lastChild;

  return (
    <Modal
      closeOnDimmerClick={true}
      closeOnDocumentClick={true}
      dimmer={undefined}
      open={modalStore.modal.open}
      size="mini"
      mountNode={calendar}
      className="info"
    >
      <Icon
        as={Button}
        icon="x"
        onClick={modalStore.closeModal}
        floated="right"
      ></Icon>
      <Modal.Header>Created by: {props.event?.createdBy}</Modal.Header>
      <div>
        Task:&nbsp;<span>{props.event?.title}</span>
      </div>
      <div>
        Added:&nbsp;
        <span>{destructureDate(new Date(props.event?.start!))}</span>
      </div>
      <div>
        Deadline:&nbsp;
        <span>{destructureDate(new Date(props.event?.deadline!))}</span>
      </div>
      <div>
        Notes:&nbsp;<span>{props.event?.notes}</span>
      </div>
    </Modal>
  );
};

export default observer(CalendarModal);
