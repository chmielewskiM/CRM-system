import React from 'react';
import { Icon, Statistic, Segment, Header } from 'semantic-ui-react';

interface IProps {
  data: { leads?: number; conversions?: number; revenue?: number; orders?: number };
}

const Statistics: React.FC<IProps> = (props) => (
  <Segment className="stat-wrapper">
    <Statistic.Group>
      <Statistic className="stat-container">
        <Statistic.Value>{props.data.leads}</Statistic.Value>
        <Statistic.Label>
          <span>Leads</span>
        </Statistic.Label>
      </Statistic>

      <Statistic className="stat-container">
        <Statistic.Value>{props.data.conversions}</Statistic.Value>
        <Statistic.Label>
          <span>Converted</span>
        </Statistic.Label>
      </Statistic>

      <Header as="h1" icon textAlign="center">
        <Icon name="trophy" circular size="mini" />
        <Header.Content>This month</Header.Content>
      </Header>
      <Statistic className="stat-container">
        <Statistic.Value>{props.data.revenue}$</Statistic.Value>
        <Statistic.Label>
          <span>Revenue</span>
        </Statistic.Label>
      </Statistic>

      <Statistic className="stat-container">
        <Statistic.Value>{props.data.orders}</Statistic.Value>
        <Statistic.Label>
          <span>Orders</span>
        </Statistic.Label>
      </Statistic>
    </Statistic.Group>
  </Segment>
);

export default Statistics;
