import React, { useContext, useEffect } from 'react';
import { Table } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import LoaderComponent from '../../../app/layout/LoaderComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';

export const ContactList: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    contactsByDate,
    selectContact,
    selectedContact,
    loadingInitial,
    showContactForm,
    rr,
  } = rootStore.contactStore;
  useEffect(() => {}, [showContactForm, rr]);
  if (loadingInitial) return <LoaderComponent content="Loading..." />;

  return (
    <>
      <Table striped selectable size='small' className='tableContainer' scrollable='false'>
        <Table.Header>
          <Table.Row >
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Company</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Phone number</Table.HeaderCell>
            <Table.HeaderCell>E-mail</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {contactsByDate.map((contact) => (
          <Table.Body key={contact.id} scrollable='true'>
            <Table.Row
              onClick={() => selectContact(contact.id)}
              active={
                selectedContact !== undefined &&
                selectedContact.id == contact.id
              }
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
    </>
  );
};

export default observer(ContactList);
