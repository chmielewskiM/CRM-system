import React, { Fragment, useContext, useEffect } from 'react';
import { Header, Divider, Label, Segment, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import ContactStore from '../../../app/stores/contactStore';
import LoaderComponent from '../../../app/layout/LoaderComponent';

export const ContactDetails: React.FC = () => {
  const contactStore = useContext(ContactStore);
  const {
    selectedContact,
    selectContact,
    deleteContact,
    submitting,
    editContactForm,
    render
  } = contactStore;
  useEffect(() => {
  }, [render]);
  if (contactStore.loadingInitial)
  return <LoaderComponent content="Loading..." />;
  return (
    <Segment>
      <Button
        floated="right"
        icon="close"
        onClick={() => {
          selectContact('');
        }}
      />
      <Fragment key={selectedContact!.id}>
        <Header as="h2" width={16}>
          Details about {selectedContact!.name}
        </Header>

        <Divider clearing />

        <Label as="a" color="red" ribbon>
          Date added {selectedContact!.dateAdded.split('T')[0]}
          {/* Date added {selectedContact.dateAdded!.toISOString().split('T')[0]} */}
        </Label>

        <Header as="h3">Deals</Header>
        <div>Successful:</div>
        <div>Unsuccessful:</div>

        <Divider section />

        <Header as="h3">Notes</Header>
        {selectedContact!.notes}
        <Button.Group widths={2}>
          <Button
            onClick={() => editContactForm(selectedContact!.id)}
            loading={submitting}
            primary
            content="Edit"
          />
          <Button
            onClick={() => deleteContact(selectedContact!.id)}
            loading={submitting}
            negative
            content="Delete"
          />
        </Button.Group>
      </Fragment>
    </Segment>
  );
};

export default observer(ContactDetails);
