import React, { useContext, useEffect } from 'react';
import { Grid, Button, ButtonGroup } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { Pipeline } from '../pipeline/Pipeline';
import Calendar from '../calendar/Calendar';
import Statistics from '../statistics/Statistics';
import LeadChart from '../chart/lead/LeadChart';
import LeadBySourceChart from '../chart/lead/LeadBySourceChart';
import OpportunityChart from '../chart/opportunity/OpportunityChart';
import OpportunityByEmployeeChart from '../chart/opportunity/OpportunityByEmployeeChart';
import RevenueChart from '../chart/revenue/RevenueChart';

export const HomeDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);

  const {
    rr,
    bool,
    leadChart,
    opportunityChart,
    showLeadChart,
    showOpportunityChart,
  } = rootStore.homeStore;

  useEffect(() => {
    console.log('dash');
  }, [rr, bool, leadChart]);

  return (
    <Grid relaxed="very" centered className="main-grid home" padded>
      <Grid.Row className="row-content-1 pipeline-calendar">
        <Grid.Column computer={7} tablet={7} mobile={16}>
          <Pipeline />
        </Grid.Column>
        <Grid.Column computer={9} tablet={9} mobile={16}>
          <Calendar />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row className="row-statistics">
        <Statistics />
      </Grid.Row>
      <Grid.Row className="row-content-2 charts" columns="equal">
        <Grid.Column computer={5} tablet={7} mobile={16} className="chart-lead">
          <ButtonGroup floated="right">
            <Button basic content="Last 30 days" />
            <Button basic content="Last 7 days" />
            {!leadChart && <Button basic content="By source" onClick={showLeadChart} />}
            {leadChart && <Button basic content="Overall" onClick={showLeadChart} />}
          </ButtonGroup>
          {!leadChart && <LeadChart />}
          {leadChart && <LeadBySourceChart />}
        </Grid.Column>

        <Grid.Column computer={5} tablet={7} mobile={16} className="chart-lead">
          <ButtonGroup floated="right">
            <Button basic content="Last 30 days" />
            <Button basic content="Last 7 days" />
            {!opportunityChart && (
              <Button basic content="By employee" onClick={showOpportunityChart} />
            )}
            {opportunityChart && <Button basic content="Overall" onClick={showOpportunityChart} />}
          </ButtonGroup>
          {!opportunityChart && <OpportunityChart />}
          {opportunityChart && <OpportunityByEmployeeChart />}
        </Grid.Column>

        <Grid.Column computer={5} tablet={7} mobile={16} className="chart-lead">
          <ButtonGroup floated="right">
            <Button basic content="Last 30 days" />
            <Button basic content="Last 7 days" />
          </ButtonGroup>
          <RevenueChart />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default observer(HomeDashboard);
