import React, { useContext } from 'react';
import { Table } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';

export const CallLog: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { contactsByDate, selectContact } = rootStore.contactStore;

  return (
    <>
      <Table celled selectable sortable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Company</Table.HeaderCell>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Phone Number</Table.HeaderCell>
            <Table.HeaderCell>Notes</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {contactsByDate.map((contact) => (
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
    </>
  );
};

export default observer(CallLog);
