import React, { useEffect } from 'react';
import { Grid, Button, ButtonGroup } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../app/stores/rootStore';
import Pipeline from '../pipeline/Pipeline';
import MyCalendar from '../calendar/Calendar';
import Statistics from '../statistics/Statistics';
import LeadsChart from '../chart/lead/LeadsChart';
import OpportunitiesChart from '../chart/opportunity/OpportunitiesChart';
import OpportunitiesByEmployeeChart from '../chart/opportunity/OpportunitiesByEmployeeChart';
import LeadsBySourceChart from '../chart/lead/LeadsBySourceChart';
import LoaderComponent from '../../../app/layout/LoaderComponent';

export const HomeDashboard: React.FC = () => {
  const { homeStore, delegatedTaskStore } = useStores();

  useEffect(() => {
    if (homeStore.operationsRegistry.size == 0) homeStore.loadOperations();
  }, []);

  return (
    <Grid relaxed="very" centered className="main-grid home" padded>
      <Grid.Row className="topbar"></Grid.Row>
      <Grid.Row className="row-content-1 pipeline-calendar">
        <Grid.Column tablet={16} computer={5} className="pipeline-column">
          <ButtonGroup floated="right">
            <Button
              basic
              content="Last 30 days"
              active={homeStore.pipelineTimeRange}
              onClick={() => homeStore.setTimeRange('pipeline', true)}
              disabled={homeStore.submitting}
            />
            <Button
              basic
              content="Last 6 months"
              active={!homeStore.pipelineTimeRange}
              onClick={() => homeStore.setTimeRange('pipeline', false)}
              disabled={homeStore.submitting}
              style={{ padding: '.5rem 2rem !important' }}
            />
          </ButtonGroup>
          <Pipeline
            data={homeStore.pipelineData}
            loading={homeStore.loadingInitial}
          />
        </Grid.Column>
        <Grid.Column tablet={16} computer={9} className="calendar-column">
          <MyCalendar
            events={delegatedTaskStore.calendarEvents}
            loading={homeStore.loadingInitial}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row className="row-statistics">
        <Statistics
          data={homeStore.thisMonthStats}
          loading={homeStore.loadingInitial}
        />
      </Grid.Row>
      <Grid.Row className="row-content-2 charts" columns="equal">
        <Grid.Column tablet={16} computer={7} className="chart">
          <ButtonGroup floated="right">
            <Button
              basic
              content="Last 30 days"
              active={homeStore.leadsChartTimeRange}
              onClick={() => homeStore.setTimeRange('leadsChart', true)}
              disabled={homeStore.submitting}
            />
            <Button
              basic
              content="Last 6 months"
              active={!homeStore.leadsChartTimeRange}
              onClick={() => homeStore.setTimeRange('leadsChart', false)}
              disabled={homeStore.submitting}
            />

            {homeStore.leadsChart && (
              <Button
                basic
                content="By source"
                onClick={homeStore.showLeadsChart}
                disabled={homeStore.submitting}
              />
            )}
            {!homeStore.leadsChart && (
              <Button
                basic
                content="Overall"
                onClick={homeStore.showLeadsChart}
                disabled={homeStore.submitting}
              />
            )}
          </ButtonGroup>
          {homeStore.leadsChart && (
            <LeadsChart
              data={homeStore.leadsChartData}
              loading={homeStore.loadingInitial}
            />
          )}
          {!homeStore.leadsChart && (
            <LeadsBySourceChart
              data={homeStore.leadsChartData}
              loading={homeStore.loadingInitial}
            />
          )}
        </Grid.Column>

        <Grid.Column tablet={16} computer={7} className="chart">
          <ButtonGroup floated="right">
            <Button
              basic
              content="Last 30 days"
              active={homeStore.opportunitiesChartTimeRange}
              onClick={() => homeStore.setTimeRange('opportunitiesChart', true)}
              disabled={homeStore.submitting}
            />
            <Button
              basic
              content="Last 6 months"
              active={!homeStore.opportunitiesChartTimeRange}
              onClick={() =>
                homeStore.setTimeRange('opportunitiesChart', false)
              }
              disabled={homeStore.submitting}
            />

            {!homeStore.opportunitiesChart && (
              <Button
                basic
                content="Overall"
                onClick={homeStore.showOpportunitiesChart}
                disabled={homeStore.submitting}
              />
            )}
            {homeStore.opportunitiesChart && (
              <Button
                basic
                content="By employee"
                onClick={homeStore.showOpportunitiesChart}
                disabled={homeStore.submitting}
              />
            )}
          </ButtonGroup>
          {!homeStore.opportunitiesChart && (
            <OpportunitiesByEmployeeChart
              data={homeStore.opportunitiesChartData}
              loading={homeStore.loadingInitial}
            />
          )}
          {homeStore.opportunitiesChart && (
            <OpportunitiesChart
              data={homeStore.opportunitiesChartData}
              loading={homeStore.loadingInitial}
            />
          )}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default observer(HomeDashboard);
