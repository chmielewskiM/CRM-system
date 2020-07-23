import React from 'react';
import { Table, Segment } from 'semantic-ui-react';
import { IContact } from '../../../app/models/contact';

interface IProps {
    contacts: IContact[];
    selectContact: (id: string) => void;
}

export const ContactList: React.FC<IProps> = ({
    contacts,
    selectContact
}) => {
    return (
        <Segment>
            <Table celled selectable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Company</Table.HeaderCell>
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Phone number</Table.HeaderCell>
                        <Table.HeaderCell>E-mail</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                {contacts.map(contact => (
                    <Table.Body key={contact.id}>
                        <Table.Row onClick={() => selectContact(contact.id)}>
                            <Table.Cell>{contact.name}</Table.Cell>
                            <Table.Cell>{contact.company}</Table.Cell>
                            <Table.Cell>{contact.type}</Table.Cell>
                            <Table.Cell>{contact.phoneNumber}</Table.Cell>
                            <Table.Cell>{contact.email}</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                ))}
            </Table>
        </Segment>
    )
}

// export default ContactList;