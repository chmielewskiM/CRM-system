import React, { useContext, useEffect } from 'react';
import { Table, Breadcrumb } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import LoaderComponent from '../../../app/layout/LoaderComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';
import LeadSettings from './LeadSettings';
import { ContactFormValues } from '../../../app/models/contact';

export const LeadList: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    contactsByDate,
    loadingInitial,
    showLeadForm,
    loadLeads,
    rr,
  } = rootStore.leadStore;
  
  useEffect(() => {}, [showLeadForm, rr]);

  if (loadingInitial) return <LoaderComponent content="Loading..." />;

  return (
    <>
      <Breadcrumb size="massive">
        <Breadcrumb.Section
          onClick={() => {
            loadLeads('Active');
          }}
        >
          Active
        </Breadcrumb.Section>
        <Breadcrumb.Divider icon="right arrow" size="massive" />
        <Breadcrumb.Section
          onClick={() => {
            loadLeads('Opportunity');
          }}
        >
          Opportunity
        </Breadcrumb.Section>
        <Breadcrumb.Divider icon="right arrow" size="massive" />
        <Breadcrumb.Section
          onClick={() => {
            loadLeads('Quote');
          }}
        >
          Quote
        </Breadcrumb.Section>
        <Breadcrumb.Divider icon="right arrow" size="massive" />
        <Breadcrumb.Section
          onClick={() => {
            loadLeads('Invoice');
          }}
        >
          Invoice
        </Breadcrumb.Section>
      </Breadcrumb>

      <Table striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Company</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Phone number</Table.HeaderCell>
            <Table.HeaderCell>E-mail</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {contactsByDate.map((contact) => (
          <Table.Body key={contact.id}>
            <Table.Row>
              <Table.Cell>{contact.name}</Table.Cell>
              <Table.Cell>{contact.company}</Table.Cell>
              <Table.Cell>{contact.status}</Table.Cell>
              <Table.Cell>{contact.phoneNumber}</Table.Cell>
              <Table.Cell>{contact.email}</Table.Cell>
              <Table.Cell>
                <LeadSettings
                  contact={new ContactFormValues(contact)}
                ></LeadSettings>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        ))}
      </Table>
    </>
  );
};

export default observer(LeadList);
