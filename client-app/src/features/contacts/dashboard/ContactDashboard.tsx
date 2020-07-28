import React, { useContext } from 'react'
import { Grid, Button } from 'semantic-ui-react'
import { ContactList } from './ContactList'
import { ContactDetails } from '../details/ContactDetails'
import { ContactForm } from '../form/ContactForm'
import { observer } from 'mobx-react-lite'
import ContactStore from '../../../app/stores/contactStore'

export const ContactDashboard: React.FC = () => {

    const contactStore = useContext(ContactStore);
    const { showForm, selectedContact, addContactForm } = contactStore;

    return (
        <Grid stackable divided='vertically'>
            {showForm && <ContactForm
            key={(selectedContact && selectedContact.id) || 0}
            contact={selectedContact!}
            />}
            <Grid.Row columns={2}>
                <Grid.Column width={9}>
                    <ContactList />
                </Grid.Column>
                <Grid.Column width={4}>
                    {selectedContact !== undefined && <ContactDetails />}
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

export default observer(ContactDashboard);
