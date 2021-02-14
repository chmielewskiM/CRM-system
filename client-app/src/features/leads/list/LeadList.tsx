import React, { useContext, useEffect, ReactElement, Fragment } from 'react';
import { Table, Breadcrumb, Segment, Button, Icon, Progress } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import LoaderComponent from '../../../app/layout/LoaderComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';
import LeadSettings from './LeadSettings';
import { ContactFormValues } from '../../../app/models/contact';
import { changeDependenciesStateTo0 } from 'mobx/lib/internal';

export const LeadList: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { contactsByDate, loadingInitial, loadLeads, rr, progress, focused } = rootStore.leadStore;

  useEffect(() => {}, [rr]);
  
  if (loadingInitial) return <LoaderComponent content="Loading..." />;

  return (
    <Fragment>
      <Segment className="buttons-status">
        <Button.Group>
          <Button
            content="Active"
            onClick={() => {
              loadLeads('Active');
              focused(15);
            }}
          />
          <div className="icon">
            <Icon name="angle double right" size="huge" />
          </div>
          <Button
            content="Opportunity"
            onClick={() => {
              loadLeads('Opportunity');
              focused(50);
            }}
          />
          <div className="icon">
            <Icon name="angle double right" size="huge" />
          </div>
          <Button
            content="Quote"
            onClick={() => {
              loadLeads('Quote');
              focused(75);
            }}
          />
          <div className="icon">
            <Icon name="angle double right" size="huge" />
          </div>
          <Button
            content="Invoice"
            onClick={() => {
              loadLeads('Invoice');
              focused(100);
            }}
          />
        </Button.Group>
        <Progress percent={progress} indicating />
      </Segment>
      <Segment className="list">
        <Table
          unstackable
          striped
          selectable
          size="small"
          className="table-container"
          scrollable="true"
          style={{ overflow: 'visible' }}
        >
          <Table.Header className="head">
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
                <Table.Cell transparent="true">
                  <LeadSettings contact={new ContactFormValues(contact)}></LeadSettings>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
      </Segment>
    </Fragment>
  );
};

export default observer(LeadList);
