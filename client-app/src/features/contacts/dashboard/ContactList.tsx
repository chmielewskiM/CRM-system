import React, { useContext, Fragment } from 'react';
import { Table } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import ContactStore from '../../../app/stores/contactStore'

export const ContactList: React.FC = () => {

    const contactStore = useContext(ContactStore);
    const { contactsByDate, selectContact, selectedContact } = contactStore;

    return (
        <Fragment>
            <Table celled selectable sortable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Company</Table.HeaderCell>
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Phone number</Table.HeaderCell>
                        <Table.HeaderCell>E-mail</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                {contactsByDate.map(contact => (
                    <Table.Body key={contact.id}>
                        <Table.Row 
                        onClick={() => selectContact(contact.id)}
                        active={selectedContact !== undefined && selectedContact.id == contact.id}
                        >
                            <Table.Cell>{contact.name}</Table.Cell>
                            <Table.Cell>{contact.company}</Table.Cell>
                            <Table.Cell>{contact.type}</Table.Cell>
                            <Table.Cell>{contact.phoneNumber}</Table.Cell>
                            <Table.Cell>{contact.email}</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                ))}
            </Table>
        </Fragment>
    )
}

export default observer(ContactList);