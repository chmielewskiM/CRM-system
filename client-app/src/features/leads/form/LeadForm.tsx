import React, { useState, useEffect } from 'react';
import { Form, Segment, Button, Modal } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { observer } from 'mobx-react-lite';
import { Form as FinalForm, Field } from 'react-final-form';
import { ContactFormValues } from '../../../app/models/contact';
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import { combineValidators, isRequired } from 'revalidate';
import { useStores } from '../../../app/stores/rootStore';
import { sources } from '../../../app/common/options/leadSource';
import SelectInput from '../../../app/common/form/SelectInput';
import { ILead, LeadFormValues } from '../../../app/models/lead';

const validation = combineValidators({
  name: isRequired({ message: 'The name is required.' }),
  // type: isRequired({ message: 'Choose who should perform the task.' }),
  // company: isRequired({ message: 'Select type of the task.' }),
  // phoneNumber: isRequired({ message: 'The date is required.' }),
  // email: isRequired({ message: 'The time is required.' }),
  // notes: isRequired({ message: 'The time is required.' }),
});

interface IProps {
  lead: ILead | undefined;
}

export const LeadForm: React.FC<IProps> = () => {
  const { leadStore } = useStores();

  useEffect(() => {}, []);

  const [contact, setContact] = useState(new ContactFormValues());

  const handleFinalFormSubmit = (values: ILead) => {
    let lead: ILead = new LeadFormValues();
    Object.assign(lead.contact, values);

    if (!lead.contact.id) {
      let newContact = {
        ...lead.contact,
        id: uuid(),
      };
      lead.order!.id = uuid();
      lead.contact.id = newContact.id;
      lead.order!.clientId = lead.contact.id;
      leadStore.addLead(lead);
    } else {
      leadStore.editLead(lead);
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
              initialValues={leadStore.fillForm()}
              render={({ handleSubmit }) => (
                <Form onSubmit={handleSubmit} size="big">
                  <Field
                    options={sources}
                    name="source"
                    placeholder="Source"
                    value={contact.source}
                    component={SelectInput}
                  />
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
                    onClick={() => leadStore.setShowLeadForm(false)}
                  />
                  <Button
                    positive
                    floated="right"
                    type="submit"
                    size="big"
                    content="Confirm"
                    loading={leadStore.submitting}
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
