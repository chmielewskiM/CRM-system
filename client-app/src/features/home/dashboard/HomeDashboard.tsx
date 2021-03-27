import React, { useContext, useEffect, useState } from 'react';
import { Grid, Button, ButtonGroup } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';
import Pipeline from '../pipeline/Pipeline';
import MyCalendar from '../calendar/Calendar';
import Statistics from '../statistics/Statistics';
import LeadsChart from '../chart/lead/LeadsChart';
import OpportunitiesChart from '../chart/opportunity/OpportunitiesChart';
import OpportunitiesByEmployeeChart from '../chart/opportunity/OpportunitiesByEmployeeChart';
// import RevenueChart from '../chart/revenue/RevenueChart';
import { createInstanceofPredicate } from 'mobx/lib/internal';
import LeadsBySourceChart from '../chart/lead/LeadsBySourceChart';
import LoaderComponent from '../../../app/layout/LoaderComponent';

export const HomeDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);

  const {
    rr,
    bool,
    leadsChart,
    opportunitiesChart,
    showLeadsChart,
    showOpportunitiesChart,
    loadOperations,
    operationsRegistry,
    predicate,
    setPredicate,
    pipelineData,
    pipelineTimeRange,
    thisMonthStats,
    leadsChartData,
    opportunitiesChartData,
    leadsChartTimeRange,
    opportunitiesChartTimeRange,
    composedChartTimeRange,
    setTimeRange,
    loadingInitial,
  } = rootStore.homeStore;

  useEffect(() => {
    rootStore.delegatedTaskStore.setTaskList('myTasks');
    rootStore.delegatedTaskStore.calendarEvents;
    if (operationsRegistry.size == 0) loadOperations();
  }, [bool, leadsChart]);
  // const a = rootStore.delegatedTaskStore.calendarEvents;
  // if (loadingInitial)
  //   return <LoaderComponent content="Loading..." />;
  return (
    <Grid relaxed="very" centered className="main-grid home" padded>
      <Grid.Row className="topbar"></Grid.Row>
      <Grid.Row className="row-content-1 pipeline-calendar">
        <Grid.Column tablet={16} computer={5} className="pipeline-column">
          <ButtonGroup floated="right">
            <Button
              basic
              content="Last 30 days"
              active={pipelineTimeRange}
              onClick={() => setTimeRange('pipeline', true)}
            />
            <Button
              basic
              content="Last 6 months"
              active={!pipelineTimeRange}
              onClick={() => setTimeRange('pipeline', false)}
              style={{ padding: '.5rem 2rem !important' }}
            />
          </ButtonGroup>
          <Pipeline data={pipelineData} loading={loadingInitial} />
        </Grid.Column>
        <Grid.Column tablet={16} computer={9} className="calendar-column">
          <MyCalendar
            events={rootStore.delegatedTaskStore.calendarEvents}
            loading={loadingInitial}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row className="row-statistics">
        <Statistics data={thisMonthStats} loading={loadingInitial} />
      </Grid.Row>
      <Grid.Row className="row-content-2 charts" columns="equal">
        <Grid.Column tablet={16} computer={7} className="chart">
          <ButtonGroup floated="right">
            <Button
              basic
              content="Last 30 days"
              active={leadsChartTimeRange}
              onClick={() => setTimeRange('leadsChart', true)}
            />
            <Button
              basic
              content="Last 6 months"
              active={!leadsChartTimeRange}
              onClick={() => setTimeRange('leadsChart', false)}
            />

            {leadsChart && (
              <Button basic content="By source" onClick={showLeadsChart} />
            )}
            {!leadsChart && (
              <Button basic content="Overall" onClick={showLeadsChart} />
            )}
          </ButtonGroup>
          {leadsChart && (
            <LeadsChart data={leadsChartData} loading={loadingInitial} />
          )}
          {!leadsChart && (
            <LeadsBySourceChart
              data={leadsChartData}
              loading={loadingInitial}
            />
          )}
        </Grid.Column>

        <Grid.Column tablet={16} computer={7} className="chart">
          <ButtonGroup floated="right">
            <Button
              basic
              content="Last 30 days"
              active={opportunitiesChartTimeRange}
              onClick={() => setTimeRange('opportunitiesChart', true)}
            />
            <Button
              basic
              content="Last 6 months"
              active={!opportunitiesChartTimeRange}
              onClick={() => setTimeRange('opportunitiesChart', false)}
            />

            {!opportunitiesChart && (
              <Button
                basic
                content="Overall"
                onClick={showOpportunitiesChart}
              />
            )}
            {opportunitiesChart && (
              <Button
                basic
                content="By employee"
                onClick={showOpportunitiesChart}
              />
            )}
          </ButtonGroup>
          {!opportunitiesChart && (
            <OpportunitiesByEmployeeChart
              data={opportunitiesChartData}
              loading={loadingInitial}
            />
          )}
          {opportunitiesChart && (
            <OpportunitiesChart
              data={opportunitiesChartData}
              loading={loadingInitial}
            />
          )}
        </Grid.Column>

        {/* <Grid.Column computer={7} tablet={7} mobile={16} className="chart">
          <ButtonGroup floated="right">
            <Button basic content="Last 6 months" active={!composedChartTimeRange} onClick={()=>setTimeRange('composedChart', false)}/>
            <Button basic content="Last 30 days" active={composedChartTimeRange} onClick={()=>setTimeRange('composedChart', true)}/>
          </ButtonGroup>
          <RevenueChart />
        </Grid.Column> */}
      </Grid.Row>
    </Grid>
  );
};

export default observer(HomeDashboard);
