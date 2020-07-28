import React, { useEffect, Fragment, useContext } from 'react';
import { Container } from 'semantic-ui-react'
import { Navbar } from '../../features/nav/Navbar';
import { ContactDashboard } from '../../features/contacts/dashboard/ContactDashboard';
import LoaderComponent from './LoaderComponent';
import ContactStore from '../stores/contactStore';
import { observer } from 'mobx-react-lite';

const App = () => {

    const contactStore = useContext(ContactStore);
    const { showForm, setShowForm, selectContact, selectedContact } = contactStore;

    useEffect(() => {
        contactStore.loadContacts();
    }, [contactStore]);

    if (contactStore.loadingInitial) return <LoaderComponent content='Loading...' />

    return (
        <Fragment>
            <Navbar />
            <Container className='wrapper'>
                <h1></h1>
                <ContactDashboard />
            </Container>
        </Fragment>
    );
}

export default observer(App);
