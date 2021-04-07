import React, { useEffect } from 'react';
import { Button, Form, Header, Icon, Label, Modal } from 'semantic-ui-react';
import { useStores } from '../../stores/rootStore';
import { observer } from 'mobx-react-lite';
import { IContact } from '../../models/contact';
import RadioInput from '../form/RadioInput';
import { Form as FinalForm, Field } from 'react-final-form';

interface IProps {
  contact?: IContact | undefined;
  function: () => void;
  header?: string;
}
export const ConfirmationModal: React.FC<IProps> = (props) => {
  const { modalStore, leadStore } = useStores();

  useEffect(() => {}, [leadStore.keepRecords, leadStore.saveContact]);

  return (
    <Modal
      basic
      open={modalStore.modal.open}
      size="small"
      className="confirmation"
    >
      <Header icon>{props.header}</Header>

      {modalStore.abandonModal && (
        <FinalForm
          onSubmit={() => undefined}
          render={({ handleSubmit }) => (
            <Form onSubmit={handleSubmit} size="big">
              <div className="save">
                <Label>Save the lead in your contacts</Label>
                <div className="fields">
                  <Field
                    name="save"
                    value={leadStore.saveContact}
                    label="Yes"
                    type="radio"
                    component={RadioInput}
                    func={leadStore.save}
                    className="yes"
                  />
                  <Field
                    name="save"
                    value={!leadStore.saveContact}
                    label="No"
                    type="radio"
                    component={RadioInput}
                    func={leadStore.save}
                    className="no"
                  />
                </div>
              </div>
              <div className="keep">
                <Label>Keep records of previous operations</Label>
                <div className="fields">
                  <Field
                    name="keep"
                    value={leadStore.keepRecords}
                    type="radio"
                    label="Yes"
                    func={leadStore.keep}
                    component={RadioInput}
                    className="yes"
                  />
                  <Field
                    name="keep"
                    value={!leadStore.keepRecords}
                    type="radio"
                    label="No"
                    func={leadStore.keep}
                    component={RadioInput}
                    className="no"
                  />
                </div>
              </div>
            </Form>
          )}
        />
      )}

      <Modal.Content content={modalStore.modal.body}></Modal.Content>
      <Modal.Actions>
        <Button basic color="red" inverted onClick={modalStore.closeModal}>
          <Icon name="remove" /> Cancel
        </Button>
        <Button
          color="green"
          inverted
          onClick={() => {
            props.function();
            modalStore.closeModal();
          }}
        >
          <Icon name="checkmark" /> Confirm
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default observer(ConfirmationModal);
