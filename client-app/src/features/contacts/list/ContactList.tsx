import React, { useContext, useEffect } from 'react';
import { Table, Segment, Grid, Icon } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import LoaderComponent from '../../../app/layout/LoaderComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { ContactControls } from './ContactControls';

export const ContactList: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    contactsList,
    loadContacts,
    orderBy,
    setOrderBy,
    selectContact,
    selectedContact,
    loadingInitial,
  } = rootStore.contactStore;
  useEffect(() => {
    loadContacts();
  }, [orderBy]);
  if (loadingInitial) return <LoaderComponent content="Loading..." />;

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
            <Table.HeaderCell onClick={() => setOrderBy('name')} className='cell-name'>
              Name
              {orderBy == 'name_desc' && <Icon name="sort descending" />}
              {orderBy == 'name_asc' && <Icon name="sort ascending" />}
              {orderBy !== 'name_asc' &&
                orderBy !== 'name_desc' && (
                  <Icon name="sort descending" className="unset-icon" />
                )}
            </Table.HeaderCell>
            <Table.HeaderCell onClick={() => setOrderBy('company')} className='cell-company'>
              Company
              {orderBy == 'company_desc' && <Icon name="sort descending" />}
              {orderBy == 'company_asc' && <Icon name="sort ascending" />}
              {orderBy !== 'company_asc' &&
                orderBy !== 'company_desc' && (
                  <Icon name="sort descending" className="unset-icon" />
                )}
            </Table.HeaderCell>
            <Table.HeaderCell onClick={() => setOrderBy('type')} className='cell-type'>
              Type
              {orderBy == 'type_desc' && <Icon name="sort descending" />}
              {orderBy == 'type_asc' && <Icon name="sort ascending" />}
              {orderBy !== 'type_asc' &&
                orderBy !== 'type_desc' && (
                  <Icon name="sort descending" className="unset-icon" />
                )}
            </Table.HeaderCell>
            <Table.HeaderCell onClick={() => setOrderBy('status')} className='cell-status'>
              Status
              {orderBy == 'status_desc' && <Icon name="sort descending" />}
              {orderBy == 'status_asc' && <Icon name="sort ascending" />}
              {orderBy !== 'status_asc' &&
                orderBy !== 'status_desc' && (
                  <Icon name="sort descending" className="unset-icon" />
                )}
            </Table.HeaderCell>
            <Table.HeaderCell className='control-icons desktop'></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {contactsList.map((contact) => (
          <Table.Body key={contact.id}>
            <Table.Row
              onClick={() => selectContact(contact.id)}
              active={
                selectedContact !== undefined &&
                selectedContact.id == contact.id
              }
            >
              <Table.Cell>
                {contact.premium == 'True' && <Icon name='star' style={{color:'gold'}}/>}
                {contact.name}</Table.Cell>
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
