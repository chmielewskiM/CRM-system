import React, { useState, useContext, useEffect } from 'react';
import { Form, Segment, Button, Modal } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Form as FinalForm, Field } from 'react-final-form';
import { IContact, ContactFormValues } from '../../../app/models/contact';
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import SelectInput from '../../../app/common/form/SelectInput';
import { options } from '../../../app/common/options/contactType';
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

export const ContactForm: React.FC<IProps> = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    setShowContactForm,
    submitting,
    addContact,
    editContact,
    fillForm,
    handleFinalFormSubmit,
  } = rootStore.contactStore;

  useEffect(() => {}, []);

  const [contact, setContact] = useState(new ContactFormValues());

  return (
    <Segment clearing>
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
                    options={options}
                    name="type"
                    placeholder="Type"
                    value={contact.type}
                    component={SelectInput}
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
                    onClick={() => setShowContactForm(false)}
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

export default observer(ContactForm);
