import React from 'react';
import { Icon, Statistic, Segment, Header } from 'semantic-ui-react';
import LoaderComponent from '../../../app/layout/LoaderComponent';

interface IProps {
  data: { leads?: number; conversions?: number; revenue?: number; orders?: number };
  loading:boolean;
}

const Statistics: React.FC<IProps> = (props) => (
  <Segment className="stat-wrapper">
    
    <Statistic.Group>
    <Segment>
      <Statistic className="stat-container">
      {props.loading && <LoaderComponent content="Loading..." />}
        <Statistic.Value>{props.data.leads}</Statistic.Value>
        <Statistic.Label>
          <span>Leads</span>
        </Statistic.Label>
      </Statistic>

      <Statistic className="stat-container">
      {props.loading && <LoaderComponent content="Loading..." />}
        <Statistic.Value>{props.data.conversions}</Statistic.Value>
        <Statistic.Label>
          <span>Converted</span>
        </Statistic.Label>
      </Statistic>
      </Segment>
      <Header as="h1" icon textAlign="center">
        <Icon name="trophy" circular size="mini" />
        <Header.Content>This month</Header.Content>
      </Header>
      <Segment>
      <Statistic className="stat-container">
      {props.loading && <LoaderComponent content="Loading..." />}
        <Statistic.Value>{props.data.revenue}$</Statistic.Value>
        <Statistic.Label>
          <span>Revenue</span>
        </Statistic.Label>
      </Statistic>

      <Statistic className="stat-container">
      {props.loading && <LoaderComponent content="Loading..." />}
        <Statistic.Value>{props.data.orders}</Statistic.Value>
        <Statistic.Label>
          <span>Orders</span>
        </Statistic.Label>
      </Statistic>
      </Segment>
    </Statistic.Group>
  </Segment>
);

export default Statistics;
