import React, { Fragment, useContext, useEffect } from 'react';
import { Header, Divider, Label, Segment, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import LoaderComponent from '../../../app/layout/LoaderComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';

export const ContactDetails: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadingInitial,
    selectedContact,
    selectContact,
    deleteContact,
    submitting,
    editContactForm,
    showContactForm,
    rr,
  } = rootStore.contactStore;

  useEffect(() => {}, [showContactForm, rr]);

  if (loadingInitial) return <LoaderComponent content="Loading..." />;
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
          {selectedContact!.name}
        </Header>

        <Divider clearing />

        <Label as="a" color="red" ribbon>
          Date added {selectedContact!.dateAdded!.toString()}
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
            onClick={() => editContactForm(selectedContact!.id!)}
            loading={submitting}
            primary
            content="Edit"
          />
          <Button
            onClick={() => deleteContact(selectedContact!.id!)}
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
