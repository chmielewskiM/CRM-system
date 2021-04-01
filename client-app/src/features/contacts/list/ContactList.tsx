import React, { useEffect } from 'react';
import { Table, Icon } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import LoaderComponent from '../../../app/layout/LoaderComponent';
import { useStores } from '../../../app/stores/rootStore';
import  ContactControls  from './ContactControls';

export const ContactList: React.FC = () => {
  const { contactStore } = useStores();

  useEffect(() => {
    contactStore.loadContacts();
  }, []);

  if (contactStore.loadingInitial)
    return <LoaderComponent content="Loading..." />;

  return (
    <>
      <Table
        unstackable
        striped
        selectable
        sortable
        size="small"
        className="table-container"
        scrollable="true"
      >
        <Table.Header className="head">
          <Table.Row>
            <Table.HeaderCell
              onClick={() => contactStore.setOrderBy('name')}
              className="cell-name"
            >
              Name
              {contactStore.orderBy == 'name_desc' && (
                <Icon name="sort descending" />
              )}
              {contactStore.orderBy == 'name_asc' && (
                <Icon name="sort ascending" />
              )}
              {contactStore.orderBy !== 'name_asc' &&
                contactStore.orderBy !== 'name_desc' && (
                  <Icon name="sort descending" className="unset-icon" />
                )}
            </Table.HeaderCell>
            <Table.HeaderCell
              onClick={() => contactStore.setOrderBy('company')}
              className="cell-company"
            >
              Company
              {contactStore.orderBy == 'company_desc' && (
                <Icon name="sort descending" />
              )}
              {contactStore.orderBy == 'company_asc' && (
                <Icon name="sort ascending" />
              )}
              {contactStore.orderBy !== 'company_asc' &&
                contactStore.orderBy !== 'company_desc' && (
                  <Icon name="sort descending" className="unset-icon" />
                )}
            </Table.HeaderCell>
            <Table.HeaderCell
              onClick={() => contactStore.setOrderBy('type')}
              className="cell-type"
            >
              Type
              {contactStore.orderBy == 'type_desc' && (
                <Icon name="sort descending" />
              )}
              {contactStore.orderBy == 'type_asc' && (
                <Icon name="sort ascending" />
              )}
              {contactStore.orderBy !== 'type_asc' &&
                contactStore.orderBy !== 'type_desc' && (
                  <Icon name="sort descending" className="unset-icon" />
                )}
            </Table.HeaderCell>
            <Table.HeaderCell
              onClick={() => contactStore.setOrderBy('status')}
              className="cell-status"
            >
              Status
              {contactStore.orderBy == 'status_desc' && (
                <Icon name="sort descending" />
              )}
              {contactStore.orderBy == 'status_asc' && (
                <Icon name="sort ascending" />
              )}
              {contactStore.orderBy !== 'status_asc' &&
                contactStore.orderBy !== 'status_desc' && (
                  <Icon name="sort descending" className="unset-icon" />
                )}
            </Table.HeaderCell>
            <Table.HeaderCell className="control-icons desktop"></Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        {contactStore.contactsList.map((contact) => (
          <Table.Body key={contact.id}>
            <Table.Row
              onClick={() => contactStore.selectContact(contact.id)}
              active={
                contactStore.selectedContact !== undefined &&
                contactStore.selectedContact.id == contact.id
              }
            >
              <Table.Cell>
                {contact.premium == 'True' && (
                  <Icon name="star" style={{ color: 'gold' }} />
                )}

                {contact.name}
              </Table.Cell>
              <Table.Cell>{contact.company}</Table.Cell>
              <Table.Cell>{contact.type}</Table.Cell>
              <Table.Cell>{contact.status}</Table.Cell>
              <Table.Cell className="control-icons desktop">
                <ContactControls contact={contact} />
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        ))}
      </Table>
    </>
  );
};

export default observer(ContactList);
