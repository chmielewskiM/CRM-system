import React, { useState, FormEvent } from 'react'
import { Form, Segment, TextArea, Select, Input, Button, Modal } from 'semantic-ui-react'
import { IContact } from '../../../app/models/contact'
import { v4 as uuid } from 'uuid';

interface IProps {
    contact: IContact;
    showForm: boolean;
    setShowForm: (showForm: boolean) => void;
    addContact: (contact: IContact) => void;
    editContact: (contact: IContact) => void;
    selectedContact: IContact;
}


export const ContactForm: React.FC<IProps> = ({
    contact: initialFormState,
    setShowForm,
    addContact,
    editContact,
    selectedContact
}) => {


    const fillForm = () => {
        if (initialFormState) {
            return initialFormState
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
        { key: 'supplier', text: 'Supplier', value: 'Supplier' },
        { key: 'shipment', text: 'Shipment', value: 'Shipment' },
        { key: 'other', text: 'Other', value: 'Other' },
        { key: 'inactive', text: 'Inactive', value: 'Inactive' },
    ]
    const [selectedValue, setSelectedValue] = useState(contact.type);

    const handleInputChange = (event: FormEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget;
        setContact({ ...contact, [name]: value })
    }

    const handleSelect = (event: FormEvent<HTMLSelectElement>) => {
        setSelectedValue(event.currentTarget.innerText);
        event.currentTarget.classList.add('Selected');
        contact.type = event.currentTarget.innerText;
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
                            <Form.Field
                                onChange={handleSelect}
                                id='form-input-control-last-name'
                                control={Select}
                                options={options}
                                name='type'
                                label='Type'
                                placeholder='Type'
                                value={selectedValue}
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
                            // error={{
                            //     content: 'Please enter a valid email address',
                            //     pointing: 'below',
                            // }}
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
                                    setShowForm(false)}
                            >
                            </Button>
                            <Button positive floated='right' type='submit' size='big' content='Confirm'>
                            </Button>

                        </Form>
                    </Segment>
                </Modal.Content>
            </Modal>
        </Segment>
    )
}
