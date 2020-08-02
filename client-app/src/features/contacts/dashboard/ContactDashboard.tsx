import React, { useContext } from 'react'
import { Grid, Button } from 'semantic-ui-react'
import { ContactList } from './ContactList'
import { ContactDetails } from '../details/ContactDetails'
import { ContactForm } from '../form/ContactForm'
import { observer } from 'mobx-react-lite'
import ContactStore from '../../../app/stores/contactStore'
import { ToastContainer, Zoom } from 'react-toastify'

export const ContactDashboard: React.FC = () => {

    const contactStore = useContext(ContactStore);
    const { showContactForm, selectedContact, addContactForm } = contactStore;

    return (
        <Grid stackable centered divided='vertically'>
            {showContactForm && <ContactForm
                key={(selectedContact && selectedContact.id) || 0}
                contact={selectedContact!}
            />}
            <Grid.Row>
                <Grid.Column width={2}>
                    <Button positive content='Add contact' onClick={addContactForm}></Button>
                    <Button yellow content='Call log'></Button>
                    <Button orange content='Deal log'></Button>
                </Grid.Column>
                <Grid.Column width={10}>
                    <ContactList />
                </Grid.Column>

            </Grid.Row>
            <Grid.Row columns={6}>
                <Grid.Column width={6}>
                    {selectedContact !== undefined && <ContactDetails />}
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

export default observer(ContactDashboard);
