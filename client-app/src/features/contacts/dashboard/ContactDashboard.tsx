import React from 'react'
import { Grid, Button } from 'semantic-ui-react'
import { IContact } from '../../../app/models/contact'
import { ContactList } from './ContactList'
import { ContactDetails } from '../details/ContactDetails'
import { ContactForm } from '../form/ContactForm'

interface IProps {
    contacts: IContact[];
    contact: IContact;
    selectContact: (id: string) => void;
    selectedContact: IContact | null;
    showForm: boolean;
    setShowForm: (showForm: boolean) => void;
    setSelectedContact: (contact: IContact | null) => void;
    addContactForm: () => void;
    addContact: (contact: IContact) => void;
    editContact: (contact: IContact) => void;
    deleteContact: (id: string) => void;
}

export const ContactDashboard: React.FC<IProps> = ({
    contacts,
    selectContact,
    selectedContact,
    setSelectedContact,
    showForm,
    setShowForm,
    contact,
    addContactForm,
    addContact,
    editContact,
    deleteContact
}) => {

    return (
        <Grid stackable divided='vertically'>

            {showForm &&
                <ContactForm
                    contact={contact!}
                    showForm={showForm}
                    setShowForm={setShowForm}
                    addContact={addContact}
                    editContact={editContact}
                    selectedContact={selectedContact!}
                />}

            <Grid.Row columns={2}>
                <Grid.Column width={9}>

                    <ContactList
                        contacts={contacts}
                        selectContact={selectContact}
                    />

                </Grid.Column>

                <Grid.Column width={4}>

                    {selectedContact && !showForm &&
                        <ContactDetails
                            contact={selectedContact}
                            showForm={showForm}
                            setShowForm={setShowForm}
                            setSelectedContact={setSelectedContact}
                            deleteContact={deleteContact}
                        />}

                    <Button positive content='Add contact' onClick={addContactForm}></Button>

                </Grid.Column>

            </Grid.Row>
            <Grid.Row columns={2}>

                <Grid.Column
                    width={6}
                    style={{ background: 'red' }}>

                </Grid.Column>
                <Grid.Column
                    width={6}
                    style={{ background: 'blue' }}>

                </Grid.Column>

            </Grid.Row>
        </Grid>
    )
}
