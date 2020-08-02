import React, { useState, FormEvent, useContext, SyntheticEvent } from 'react'
import { Form, Segment, TextArea, Select, Input, Button, Modal } from 'semantic-ui-react'
import { IContact } from '../../../app/models/contact'
import { v4 as uuid } from 'uuid';
import { observer } from 'mobx-react-lite';
import ContactStore from '../../../app/stores/contactStore'

interface IProps {
    contact: IContact | undefined;
}


export const ContactForm: React.FC<IProps> = () => {

    const contactStore = useContext(ContactStore);
    const {
        showContactForm,
        selectedContact,
        setShowContactForm,
        submitting,
        addContact,
        editContact,
        updateFormSelect
    } = contactStore;

    const fillForm = () => {
        if (selectedContact) {
            setValue(selectedContact.type)
            return selectedContact
        } else {
            return {
                id: '',
                name: '',
                company: '',
                type: '',
                phoneNumber: '',
                email: '',
                dateAdded: '',
                notes: ''
            }
        }
    };

    const [value, setValue] = useState('');
    const [contact, setContact] = useState<IContact>(fillForm);

    const handleSubmit = () => {
        if (contact.id.length === 0) {
            let newContact = {
                ...contact,
                id: uuid()
            }
            addContact(newContact);
        } else {
            editContact(contact);
        }

    }

    var options = [
        { key: 'Lead', text: 'Lead', value: 'Lead' },
        { key: 'Client', text: 'Client', value: 'Client' },
        { key: 'Team', text: 'Team', value: 'Team' },
        { key: 'Supplier', text: 'Supplier', value: 'Supplier' },
        { key: 'Shipment', text: 'Shipment', value: 'Shipment' },
        { key: 'Other', text: 'Other', value: 'Other' },
        { key: 'Inactive', text: 'Inactive', value: 'Inactive' },
    ]

    const handleInputChange = (event: FormEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget;
        setContact({ ...contact, [name]: value });
    }

    const handleSelect = (event: SyntheticEvent<HTMLElement, Event>) => {
        setValue(event.currentTarget.innerText);
        event.currentTarget.classList.add('Selected');
        updateFormSelect(event.currentTarget.innerText);
    }

    return (

        <Segment clearing>
            <Modal
                as={Form}
                open={true}
            >
                <Modal.Content>
                    <Segment clearing size='big'>
                        <Form onSubmit={handleSubmit} size='big'>
                            <Form.Field
                                onChange={handleInputChange}
                                id='form-input-control-first-name'
                                control={Input}
                                name='name'
                                label='Name'
                                placeholder='Name'
                                value={contact.name}
                            />
                            <Form.Select
                                onChange={handleSelect}
                                id='form-input-control-last-name'
                                control={Select}
                                options={options}
                                name='type'
                                label='Type'
                                placeholder='Type'
                                value={value}
                            />
                            <Form.Field
                                onChange={handleInputChange}
                                id='form-input-control-last-name'
                                control={Input}
                                name='company'
                                label='Company'
                                placeholder='company'
                                value={contact.company}
                            />
                            <Form.Field
                                onChange={handleInputChange}
                                id='form-input-control-last-name'
                                control={Input}
                                name='phoneNumber'
                                label='Phone number'
                                placeholder='Phone number'
                                value={contact.phoneNumber}
                            />
                            <Form.Field
                                onChange={handleInputChange}
                                id='form-input-control-error-email'
                                control={Input}
                                name='email'
                                label='Email'
                                placeholder='e-mail address'
                                value={contact.email}
                            />
                            <Form.Field
                                onChange={handleInputChange}
                                id='form-textarea-control-opinion'
                                control={TextArea}
                                name='notes'
                                label='Notes'
                                placeholder='Notes'
                                value={contact.notes}
                            />

                            <Button negative floated='right' type='button' size='big' content='Cancel'
                                onClick={() =>
                                    setShowContactForm(false)}
                            >
                            </Button>
                            <Button positive floated='right' type='submit' size='big' content='Confirm'
                                loading={submitting}
                            >
                            </Button>

                        </Form>
                    </Segment>
                </Modal.Content>
            </Modal>
        </Segment>
    )
}

export default observer(ContactForm);