import React, { useState, useContext, SyntheticEvent, useEffect } from 'react';
import { Form, Segment, Button, Modal } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { observer } from 'mobx-react-lite';
import { Form as FinalForm, Field } from 'react-final-form';
import ContactStore from '../../../app/stores/contactStore';
import { IContact } from '../../../app/models/contact';
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import SelectInput from '../../../app/common/form/SelectInput';
import { options } from '../../../app/common/options/contactType';

interface IProps {
  contact: IContact | undefined;
}

export const ContactForm: React.FC<IProps> = () => {
  const contactStore = useContext(ContactStore);
  const {
    selectedContact,
    setShowContactForm,
    submitting,
    updateFormSelect,
    render,
  } = contactStore;
  useEffect(() => {
  }, [render]);
  const fillForm = () => {
    if (selectedContact) {
      setValue(selectedContact.type);
      return selectedContact;
    }
    return {
      id: '',
      name: '',
      company: '',
      type: '',
      phoneNumber: '',
      email: '',
      dateAdded: '',
      notes: '',
    };
  };

  const [value, setValue] = useState('');
  const [contact, setContact] = useState<IContact>(fillForm);

  // const handleSubmit = () => {
  //     if (contact.id.length === 0) {
  //         let newContact = {
  //             ...contact,
  //             id: uuid()
  //         }
  //         addContact(newContact);
  //     } else {
  //         editContact(contact);
  //     }

  // }

  const handleFinalFormSubmit = (values: any) => {
    
  };

  const handleSelect = (event: SyntheticEvent<HTMLElement, Event>) => {
    setValue(event.currentTarget.innerText);
    event.currentTarget.classList.add('Selected');
    updateFormSelect(event.currentTarget.innerText);
  };

  return (
    <Segment clearing>
      <Modal open>
        <Modal.Content>
          <Segment clearing size="big">
            <FinalForm
              onSubmit={handleFinalFormSubmit}
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
                    value={value}
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
                    placeholder="e-mail address"
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
