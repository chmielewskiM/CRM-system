import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react'
import { Navbar } from '../../features/nav/Navbar';
import { ContactDashboard } from '../../features/contacts/dashboard/ContactDashboard';
import { IContact } from '../models/contact';

const App = () => {

    const [contacts, setContacts] = useState<IContact[]>([]);
    const [selectedContact, setSelectedContact] = useState<IContact | null>(null);
    const [showForm, setShowForm] = useState(false);

    const handleSelectContact = (id: string) => {
        setSelectedContact(contacts.filter(a => a.id === id)[0])
    }

    const handleAddContactForm = () => {
        setSelectedContact(null);
        setShowForm(true);
    }

    const handleAddContact = (contact: IContact) => {
        contact.dateAdded = new Date().toLocaleDateString();
        setContacts([...contacts, contact]);
        setSelectedContact(contact);
        setShowForm(false);
    }

    const handleEditContact = (contact: IContact) => {
        setContacts([...contacts.filter(a => a.id !== contact.id), contact]);
        setSelectedContact(contact);
        setShowForm(false);
    }

    const handleDeleteContact = (id: string) => {
        setContacts([...contacts.filter(a => a.id !== id)])
        setSelectedContact(null);
    }

    useEffect(() => {
        axios
            .get<IContact[]>('http://localhost:5000/contact')
            .then(response => {
                setContacts(response.data)
            });
    }, []);

    return (
        <Fragment>
            <Navbar />
            <Container className='wrapper'>
                <ContactDashboard
                    contacts={contacts}
                    contact={selectedContact!}
                    selectContact={handleSelectContact}
                    selectedContact={selectedContact!}
                    showForm={showForm}
                    setShowForm={setShowForm}
                    setSelectedContact={setSelectedContact}
                    addContactForm={handleAddContactForm}
                    addContact={handleAddContact}
                    editContact={handleEditContact}
                    deleteContact={handleDeleteContact}
                />
            </Container>
        </Fragment>
    );
}

export default App;
