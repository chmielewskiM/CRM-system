import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Button, Form, Header, Icon, Label, Modal } from 'semantic-ui-react';
import { RootStoreContext } from '../../stores/rootStore';
import { observer } from 'mobx-react-lite';
import { IContact } from '../../models/contact';
import {
  DelegatedTaskFormValues,
  IDelegatedTask,
} from '../../models/delegatedTask';
import RadioInput from '../form/RadioInput';
import { Form as FinalForm, Field } from 'react-final-form';

interface IProps {
  contact?: IContact | undefined;
  function: () => void;
  header?: string;
}
export const ConfirmationModal: React.FC<IProps> = (props) => {
  const rootStore = useContext(RootStoreContext);
  const {
    modal: { open, body },
    closeModal,
    confirmModal,
    modal,
    abandonModal,
    rr,
  } = rootStore.modalStore;
  const { saveContact, save, keep, keepRecords } = rootStore.leadStore;
  useEffect(() => {}, [rr]);

  // const [save, setSave] =useState(saveContact);
  // const [keepRecords, setKeepRecords] =useState(false);

  return (
    <Modal basic open={open} size="small" className="confirmation">
      <Header icon>{props.header}</Header>

      {abandonModal && (
        <FinalForm
          onSubmit={() => undefined}
          render={({ handleSubmit }) => (
            <Form onSubmit={handleSubmit} size="big">
              <div className="save">
                <Label>Save the lead in your contacts</Label>
                <div className="fields">
                  <Field
                    name="save"
                    value={saveContact}
                    label="Yes"
                    type="radio"
                    component={RadioInput}
                    func={() => save(saveContact)}
                    className="yes"
                  />
                  <Field
                    name="save"
                    value={!saveContact}
                    label="No"
                    type="radio"
                    component={RadioInput}
                    func={() => save(saveContact)}
                    className="no"
                  />
                </div>
              </div>
              <div className="keep">
                <Label>Keep records of previous operations</Label>
                <div className="fields">
                  <Field
                    name="keep"
                    value={keepRecords}
                    type="radio"
                    label="Yes"
                    func={() => keep(keepRecords)}
                    component={RadioInput}
                    className="yes"
                  />
                  <Field
                    name="keep"
                    value={!keepRecords}
                    type="radio"
                    label="No"
                    func={() => keep(keepRecords)}
                    component={RadioInput}
                    className="no"
                  />
                </div>
              </div>
            </Form>
          )}
        />
      )}

      <Modal.Content content={modal.body}></Modal.Content>
      <Modal.Actions>
        <Button basic color="red" inverted onClick={closeModal}>
          <Icon name="remove" /> Cancel
        </Button>
        <Button color="green" inverted onClick={() => {props.function(); closeModal()}}>
          <Icon name="checkmark" /> Confirm
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default observer(ConfirmationModal);
