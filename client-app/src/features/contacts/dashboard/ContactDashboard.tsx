import React, { useContext, useEffect } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { ContactList } from './ContactList';
import { ContactDetails } from '../details/ContactDetails';
import { ContactForm } from '../form/ContactForm';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { ArchivedLog } from '../../archivedLogs/ArchivedLog';
import LoaderComponent from '../../../app/layout/LoaderComponent';

export const ContactDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    showContactForm,
    selectedContact,
    addContactForm,
    loadContacts,
    selectContact,
    editContactForm,
    deleteContact,
    submitting,
    loadingInitial
  } = rootStore.contactStore;
  const { expandMenu } = rootStore.commonStore;

  useEffect(() => {
    loadContacts();
    if (selectedContact) selectContact(selectedContact!.id);
  }, [showContactForm]);

  if (loadingInitial)
    return <LoaderComponent content="Loading..." />;

  return (
    <Grid stackable centered className="main-grid">
      {showContactForm && (
        <ContactForm
          key={(selectedContact && selectedContact.id) || 0}
          contact={selectedContact!}
        />
      )}
      <Grid.Row className="topbar">
        <Button positive icon="plus" content="Add contact" onClick={addContactForm} />
        <Button content="Call log" />
        <Button content="Deal log" />
        {selectContact && (
          <Button
            onClick={() => editContactForm(selectedContact!.id!)}
            loading={submitting}
            primary
            content="Edit"
          />
        )}
        {selectContact && (
          <Button
            onClick={() => deleteContact(selectedContact!.id!)}
            loading={submitting}
            negative
            content="Delete"
          />
        )}
        <Button icon="angle down" className="expand-menu" onClick={(event) => expandMenu(event)} />
      </Grid.Row>
      <Grid.Row className="row-content-1">
        <Grid.Column width={12}>
          <ContactList />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={6} className="row-content-2">
        <Grid.Column width={6}>{selectedContact !== undefined && <ContactDetails />}</Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default observer(ContactDashboard);
