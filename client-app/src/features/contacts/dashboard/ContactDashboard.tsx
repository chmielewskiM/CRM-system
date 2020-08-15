import React, { useContext, useEffect } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { ContactList } from './ContactList';
import { ContactDetails } from '../details/ContactDetails';
import { ContactForm } from '../form/ContactForm';
import { RootStoreContext } from '../../../app/stores/rootStore';

export const ContactDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    showContactForm,
    selectedContact,
    addContactForm,
    loadContacts,
    selectContact,
  } = rootStore.contactStore;

  useEffect(() => {
    loadContacts();
    if (selectedContact) selectContact(selectedContact!.id);
  }, [showContactForm]);

  // if (contactStore.loadingInitial)
  //   return <LoaderComponent content="Loading..." />;

  return (
    <Grid stackable centered divided="vertically">
      {showContactForm && (
        <ContactForm
          key={(selectedContact && selectedContact.id) || 0}
          contact={selectedContact!}
        />
      )}
      <Grid.Row>
        <Grid.Column width={2}>
          <Button positive content="Add contact" onClick={addContactForm} />
          <Button content="Call log" />
          <Button content="Deal log" />
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
  );
};

export default observer(ContactDashboard);
