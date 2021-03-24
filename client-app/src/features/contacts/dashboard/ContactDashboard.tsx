import React, { useContext, useEffect } from 'react';
import { Grid, Button, Label, Segment, Input } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { ContactList } from '../list/ContactList';
import { ContactDetails } from '../details/ContactDetails';
import { ContactForm } from '../form/ContactForm';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { contactButtons } from '../../../app/common/options/buttons';
import ShareContactForm from '../form/ShareContactForm';
import { Lead, LeadFormValues } from '../../../app/models/lead';

export const ContactDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    showContactForm,
    selectedContact,
    setContactList,
    addContactForm,
    startSaleProcess,
    shareContactForm,
    handleSearch,
    setPagination,
    activePage,
    contactsTotal,
    submitting,
    rr,
  } = rootStore.contactStore;
  const { expandMenu } = rootStore.commonStore;

  useEffect(() => {
  }, [rr]);

  return (
    <Grid stackable centered className="main-grid contacts">
      {showContactForm && (
        <ContactForm
          key={(selectedContact && selectedContact.id) || 0}
          contact={selectedContact!}
        />
      )}
      {shareContactForm && <ShareContactForm />}
      <Grid.Row className="topbar">
        <Button
          positive
          icon="plus"
          content="Add contact"
          onClick={addContactForm}
        />
        {selectedContact?.status == 'Inactive' && (
          <Button
            onClick={startSaleProcess}
            loading={submitting}
            icon="target"
            primary
            content="Start sale process"
          />
        )}
        <Button
          icon="angle down"
          className="expand-menu"
          onClick={(event) => expandMenu(event)}
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
                  setContactList(button.functionArg, e.currentTarget)
                }
              />
            ))}
          </Button.Group>
          <Button.Group className="pagination">
            <Button
              icon="chevron left"
              onClick={() => setPagination(-1)}
              disabled={activePage <= 0}
            />
            <span className="contacts-from">
              {activePage < 1 && '1'}
              {activePage >= 1 && activePage.toString().concat('1')}
            </span>
            <span>-</span>
            <span className="contacts-to">10&nbsp;</span>
            <span className="contacts-all"> /&nbsp;{contactsTotal}</span>
            <Button
              icon="chevron right"
              onClick={() => setPagination(1)}
              disabled={activePage+1 > contactsTotal / 10}
            />
          </Button.Group>
          <Input
            className="filter-input"
            onChange={handleSearch}
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
          {selectedContact !== undefined && (
            <ContactDetails contact={selectedContact} />
          )}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default observer(ContactDashboard);
