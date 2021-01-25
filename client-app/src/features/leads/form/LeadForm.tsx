import React, { useState, useContext, useEffect } from 'react';
import { Form, Segment, Button, Modal } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { observer } from 'mobx-react-lite';
import { Form as FinalForm, Field } from 'react-final-form';
import { IContact, ContactFormValues } from '../../../app/models/contact';
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import { combineValidators, isRequired } from 'revalidate';
import { RootStoreContext } from '../../../app/stores/rootStore';

const validation = combineValidators({
  name: isRequired({ message: 'The name is required.' }),
  // type: isRequired({ message: 'Choose who should perform the task.' }),
  // company: isRequired({ message: 'Select type of the task.' }),
  // phoneNumber: isRequired({ message: 'The date is required.' }),
  // email: isRequired({ message: 'The time is required.' }),
  // notes: isRequired({ message: 'The time is required.' }),
});

interface IProps {
  contact: IContact | undefined;
}

export const LeadForm: React.FC<IProps> = () => {
  const rootStore = useContext(RootStoreContext);
  const { setShowLeadForm, submitting, addLead, editLead, fillForm, rr } = rootStore.leadStore;

  useEffect(() => {}, [rr]);

  const [contact, setContact] = useState(new ContactFormValues());

  const handleFinalFormSubmit = (values: any) => {
    const { ...contact } = values;
    if (!contact.id) {
      let newLead = {
        ...contact,
        id: uuid(),
      };
      addLead(newLead);
    } else {
      editLead(contact);
    }
  };

  return (
    <Segment clearing className="form-container">
      <Modal open>
        <Modal.Content>
          <Segment clearing size="big">
            <FinalForm
              validate={validation}
              onSubmit={handleFinalFormSubmit}
              initialValues={fillForm()}
              render={({ handleSubmit }) => (
                <Form onSubmit={handleSubmit} size="big">
                  <Field
                    name="name"
                    placeholder="Name"
                    value={contact.name}
                    component={TextInput}
                  />
                  <Field
                    name="company"
                    placeholder="company"
                    value={contact.company}
                    component={TextInput}
                  />
                  <Field
                    name="phoneNumber"
                    placeholder="Phone number"
                    value={contact.phoneNumber}
                    component={TextInput}
                  />
                  <Field
                    name="email"
                    placeholder="E-mail address"
                    value={contact.email}
                    component={TextInput}
                  />
                  <Field
                    name="notes"
                    placeholder="Notes"
                    value={contact.notes}
                    component={TextAreaInput}
                  />

                  <Button
                    negative
                    floated="right"
                    type="button"
                    size="big"
                    content="Cancel"
                    onClick={() => setShowLeadForm(false)}
                  />
                  <Button
                    positive
                    floated="right"
                    type="submit"
                    size="big"
                    content="Confirm"
                    loading={submitting}
                  />
                </Form>
              )}
            />
          </Segment>
        </Modal.Content>
      </Modal>
    </Segment>
  );
};

export default observer(LeadForm);
