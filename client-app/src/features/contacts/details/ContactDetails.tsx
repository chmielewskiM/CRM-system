import React, { Fragment, useContext, useEffect } from 'react';
import { Header, Divider, Label, Segment, Button, LabelGroup } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import LoaderComponent from '../../../app/layout/LoaderComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';

export const ContactDetails: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadingInitial,
    selectedContact,
    selectContact,
    showContactForm,
    rr,
  } = rootStore.contactStore;

  useEffect(() => {}, [showContactForm, rr]);

  if (loadingInitial) return <LoaderComponent content="Loading..." />;
  return (
    <Segment className="details">
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

        <Label as="a" ribbon>
          Date added {selectedContact!.dateAdded!.toString()}
          {/* Date added {selectedContact.dateAdded!.toISOString().split('T')[0]} */}
        </Label>

        <Header as="h3">Deals</Header>
        <LabelGroup className="deals">
          <Label className="successful">Successful: 5</Label>
          <Label className="unsuccessful">Unsuccessful: 12</Label>
        </LabelGroup>
        <Divider section />

        <Header as="h3">Notes</Header>
        <div className="notes">{selectedContact!.notes}</div>
        <Button.Group widths={2}></Button.Group>
      </Fragment>
    </Segment>
  );
};

export default observer(ContactDetails);
