import React, { Fragment, useEffect } from 'react';
import { Header, Label, Segment, Button, Grid, Icon } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import LoaderComponent from '../../../app/layout/LoaderComponent';
import { useStores } from '../../../app/stores/rootStore';
import { MinorHeader } from '../../../app/common/headers/MinorHeader';
import { destructureDate } from '../../../app/common/util/util';
import { IContact } from '../../../app/models/contact';

interface IProps {
  contact: IContact;
}

export const ContactDetails: React.FC<IProps> = (props) => {
  const { contactStore } = useStores();

  useEffect(() => {}, [contactStore.contactsTotal]);

  return (
    <Fragment>
      <MinorHeader
        as="h1"
        content={props.contact.name}
        controls={true}
        contact={props.contact}
        function={() => contactStore.selectContact('')}
      />
      <Segment className="contact-details">
        {contactStore.loadingInitial && (
          <LoaderComponent content="Loading..." />
        )}
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
              {contactStore.convertPremiumValue == false && (
                <Button
                  className="not premium"
                  icon="star outline"
                  content="Promote to premium"
                  onClick={() =>
                    contactStore.premiumUpgrade(contactStore.selectedContact!)
                  }
                />
              )}
              {contactStore.convertPremiumValue == true && (
                <Button
                  className="premium"
                  onClick={() =>
                    contactStore.premiumUpgrade(contactStore.selectedContact!)
                  }
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
