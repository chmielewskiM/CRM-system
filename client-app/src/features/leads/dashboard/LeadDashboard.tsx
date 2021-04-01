import React, { useEffect, useState } from 'react';
import { Grid, Button, Segment, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import LeadForm from '../form/LeadForm';
import { useStores } from '../../../app/stores/rootStore';
import LeadList from '../list/LeadList';
import { filterLeads } from '../../../app/common/options/buttons';

export const LeadDashboard: React.FC = () => {
  const { leadStore, commonStore } = useStores();

  useEffect(() => {}, []);

  const [sortBy, setSortBy] = useState('date');

  return (
    <Grid className="main-grid">
      {leadStore.showLeadForm && (
        <LeadForm
          key={
            (leadStore.selectedLead && leadStore.selectedLead.contact.id) || 0
          }
          lead={leadStore.selectedLead!}
        />
      )}
      <Grid.Row className="topbar">
        <Button
          positive
          icon="plus"
          content="Add lead"
          onClick={leadStore.addLeadForm}
        />
        <Button
          icon="angle down"
          className="expand-menu"
          onClick={(event) => commonStore.expandMenu(event)}
        />
      </Grid.Row>
      <Grid.Row className="row-content-1 leads">
        <Segment attached="top" className="filter-buttons">
          <Button.Group floated="left">
            <Label basic content="Filter leads:" />
            {filterLeads.map((button) => (
              <Button
                key={button.key}
                as={button.as}
                active={button.btnActive == leadStore.status}
                content={button.content}
                size={button.size}
                compact={button.compact}
                className={button.className}
                onClick={(e) =>
                  leadStore.setLeadList(
                    button.functionArg,
                    sortBy,
                    e.currentTarget
                  )
                }
              />
            ))}
          </Button.Group>
          <Button.Group className="sort-btns">
            <Label content="Sort by: " />
            <Button
              active
              content="Date"
              onClick={(e) => {
                setSortBy('date');
                leadStore.setLeadList(
                  leadStore.status,
                  'date',
                  e.currentTarget
                );
              }}
            />
            <Button
              content="Name"
              onClick={(e) => {
                setSortBy('name');
                leadStore.setLeadList(
                  leadStore.status,
                  'name',
                  e.currentTarget
                );
              }}
            />
          </Button.Group>
        </Segment>
        <LeadList sortBy={sortBy} />
      </Grid.Row>
    </Grid>
  );
};

export default observer(LeadDashboard);
