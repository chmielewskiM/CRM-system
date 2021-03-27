import React, { Fragment, useContext, useEffect } from 'react';
import { Header, Label, Segment, Button, Grid, Icon } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import LoaderComponent from '../../../app/layout/LoaderComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { MinorHeader } from '../../../app/common/headers/MinorHeader';
import { destructureDate } from '../../../app/common/util/util';
import { IContact } from '../../../app/models/contact';

interface IProps {
  contact: IContact;
}

export const ContactDetails: React.FC<IProps> = (props) => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadingInitial,
    submitting,
    selectContact,
    selectedContact,
    showContactForm,
    premiumUpgrade,
    convertPremiumValue,
    rr,
  } = rootStore.contactStore;

  useEffect(() => {}, [convertPremiumValue]);

  if (loadingInitial) return <LoaderComponent content="Loading..." />;
  return (
    <Fragment>
      <MinorHeader
        as="h1"
        content={props.contact.name}
        controls={true}
        contact={props.contact}
        function={() => selectContact('')}
      />
      <Segment className="contact-details">
        <Grid>
          <Grid.Column width={8}>
            <div className="date">
              <Label as="a" ribbon>
                Date added{' '}
                {destructureDate(new Date(props.contact!.dateAdded!))}
              </Label>
            </div>
            <div className="phone">
              {`Tel.No.: ${props.contact.phoneNumber}`}
            </div>

            <div className="email">{`E-mail: ${props.contact.email}`}</div>
          </Grid.Column>
          <Grid.Column width={7} className="right">
            <div className="mark-premium">
              {convertPremiumValue == false && (
                <Button
                  className="not premium"
                  icon="star outline"
                  content="Promote to premium"
                  onClick={() => premiumUpgrade(selectedContact!)}
                />
              )}
              {convertPremiumValue == true && (
                <Button
                  className="premium"
                  onClick={() => premiumUpgrade(selectedContact!)}
                >
                  <Icon name="star" /> Premium{' '}
                  <Icon
                    name="arrow alternate circle down"
                    style={{ color: 'red' }}
                  />
                </Button>
              )}
            </div>
            <div className="status">{`Status: ${props.contact.status}`}</div>
            <div className="deals">{`Deals: ${props.contact.successfulDeals}`}</div>
          </Grid.Column>
          <Grid.Row>
            {props.contact!.notes != '' && (
              <div className="notes">
                <Header as="h3">Notes</Header>
                <p>{props.contact!.notes}</p>
              </div>
            )}
          </Grid.Row>
        </Grid>
      </Segment>
    </Fragment>
  );
};

export default observer(ContactDetails);
