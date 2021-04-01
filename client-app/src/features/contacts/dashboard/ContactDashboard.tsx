import React, { useEffect } from 'react';
import { Grid, Button, Label, Segment, Input } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import ContactList from '../list/ContactList';
import ContactDetails from '../details/ContactDetails';
import ContactForm from '../form/ContactForm';
import { useStores } from '../../../app/stores/rootStore';
import { contactButtons } from '../../../app/common/options/buttons';
import ShareContactForm from '../form/ShareContactForm';
import homeStore from '../../../app/stores/homeStore';

export const ContactDashboard: React.FC = () => {
  const { contactStore, commonStore } = useStores();

  useEffect(() => {
    contactStore.selectContact('');
  }, []);

  return (
    <Grid stackable centered className="main-grid contacts">
      {contactStore.showContactForm && (
        <ContactForm
          key={
            (contactStore.selectedContact && contactStore.selectedContact.id) ||
            0
          }
          contact={contactStore.selectedContact!}
        />
      )}
      {contactStore.shareContactForm && <ShareContactForm />}
      <Grid.Row className="topbar">
        <Button
          positive
          icon="plus"
          content="Add contact"
          onClick={contactStore.addContactForm}
        />
        {contactStore.selectedContact?.status == 'Inactive' && (
          <Button
            onClick={contactStore.startSaleProcess}
            loading={contactStore.submitting}
            icon="target"
            primary
            content="Start sale process"
          />
        )}
        <Button
          icon="angle down"
          className="expand-menu"
          onClick={(event) => commonStore.expandMenu(event)}
        />
      </Grid.Row>

      <Grid.Row className="row-content-1 contacts">
        <Segment attached="top" floated="left" className="filter-buttons">
          <Button.Group floated="left">
            <Label basic content="Filter contacts:" />
            {contactButtons.map((button: any) => (
              <Button
                key={button.key}
                as={button.as}
                icon={button.icon}
                content={button.content}
                size={button.size}
                compact={button.compact}
                className={button.className}
                onClick={(e) =>
                  contactStore.setContactList(
                    button.functionArg,
                    e.currentTarget
                  )
                }
              />
            ))}
          </Button.Group>
          <Button.Group className="pagination">
            <Button
              icon="chevron left"
              onClick={() => contactStore.setPagination(-1)}
              disabled={contactStore.activePage <= 0}
            />
            <span className="contacts-from">
              {contactStore.activePage < 1 && '1'}
              {contactStore.activePage >= 1 &&
                contactStore.activePage.toString().concat('1')}
            </span>
            <span className="contacts-to">-10&nbsp;</span>
            <span className="contacts-all">
              {' '}
              /&nbsp;{contactStore.contactsTotal}
            </span>
            <Button
              icon="chevron right"
              onClick={() => contactStore.setPagination(1)}
              disabled={
                contactStore.activePage + 1 > contactStore.contactsTotal / 10
              }
            />
          </Button.Group>
          <Input
            className="filter-input"
            onChange={contactStore.handleSearch}
            icon="search"
            label="Search"
          />
        </Segment>
        <Segment attached="bottom" className="list">
          <ContactList />
        </Segment>
      </Grid.Row>
      <Grid.Row className="row-content-2">
        <Grid.Column mobile={16} computer={9} largeScreen={7}>
          {contactStore.selectedContact !== undefined && (
            <ContactDetails contact={contactStore.selectedContact} />
          )}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default observer(ContactDashboard);
