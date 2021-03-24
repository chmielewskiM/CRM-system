import React, { useContext, useEffect, Fragment, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';
import {
  Button,
  Container,
  Grid,
  Header,
  Icon,
  Progress,
  Segment,
} from 'semantic-ui-react';
import { ILead, LeadFormValues } from '../../../app/models/lead';
import LeadControls from './LeadControls';
import ConfirmationModal from '../../../app/common/modals/ConfirmationModal';
import LoaderComponent from '../../../app/layout/LoaderComponent';

interface IProps {
  sortBy: string;
}

export const LeadList: React.FC<IProps> = (props) => {
  const rootStore = useContext(RootStoreContext);
  const { modal } = rootStore.modalStore;

  const {
    loadingInitial,
    submitting,
    loadLeads,
    leadsList,
    abandonLead,
    targetLead,
    rr,
  } = rootStore.leadStore;

  useEffect(() => {
    loadLeads();
  }, []);

  const progress = (status: string) => {
    switch (status) {
      case 'Lead':
        return 25;
      case 'Opportunity':
        return 50;
      case 'Quote':
        return 75;
      case 'Invoice':
        return 95;
    }
  };

  const [showDetails, setShowDetails] = useState(false);
  const [target, setTarget] = useState(new LeadFormValues());

  return (
    <Segment className='list'>
      {leadsList.map((lead: ILead) => (
        <Segment
          key={lead.contact.id}
          className={`lead-item ${lead.contact.status.toLowerCase()}`}
        >
          {loadingInitial ||
            (submitting && <LoaderComponent content="Loading..." />)}
          {modal.open && lead == targetLead && (
            <ConfirmationModal
              contact={lead.contact}
              function={() => abandonLead()}
              header={lead.contact.name}
            />
          )}
          {showDetails && lead == target && (
            <Fragment>
              <div className="details">
                <Button icon="minus" onClick={() => setShowDetails(false)} />
                <div className="email">
                  Email: <span>{lead.contact.email}</span>
                </div>
                <div className="status">
                  Tel.No.: <span>{lead.contact.phoneNumber}</span>
                </div>
                <div className="source">
                  Source: <span>{lead.contact.source}</span>
                </div>
                <div className="notes">
                  Notes: <span>{lead.contact.notes}</span>
                </div>
              </div>
            </Fragment>
          )}
          <Grid>
            <Grid.Row className="row-header">
              <span
                className="more"
                onClick={(e) => {
                  setShowDetails(true);
                  setTarget(lead);
                }}
              >
                Show more...
              </span>
              <Header
                className="name"
                content={`Client: ${lead.contact.name}`}
              />
              <Header
                className="company"
                content={`Company: ${lead.contact.company}`}
              />
              <Container className="order" text>
                Order: {lead.order?.orderNumber}
                {lead.order?.id == null && (
                  <Icon
                    name="question circle outline"
                    style={{ color: 'red' }}
                  />
                )}
                {lead.order?.id == null && lead.contact.status =='Quote' && (
                  <p style={{color:'red'}}>Add an order to proceed.</p>
                )}

              </Container>
            </Grid.Row>
            <Grid.Row className="row lead-controls">
              <LeadControls lead={lead} />
            </Grid.Row>
            <Grid.Row className="row-progress">
              <Progress
                label=""
                percent={progress(lead.contact.status)}
                indicating
              />
            </Grid.Row>
          </Grid>
        </Segment>
      ))}
    </Segment>
  );
};

export default observer(LeadList);
