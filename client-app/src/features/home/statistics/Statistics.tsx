import React from 'react';
import { Icon, Image, Statistic, Segment, Header } from 'semantic-ui-react';

const StatisticExampleValue = () => (
  <Segment className="stat-wrapper">
      
    <Statistic.Group>
        <Statistic className='stat-container'>
          <Statistic.Value>27</Statistic.Value>
          <Statistic.Label><span>Leads</span></Statistic.Label>
        </Statistic>
      
      
        <Statistic className='stat-container'>
        <Statistic.Value>4</Statistic.Value>
          <Statistic.Label><span>Converted</span></Statistic.Label>
        </Statistic>
      
        <Header as='h1' icon textAlign='center'>
      <Icon name='trophy' circular size='mini'/>
      <Header.Content>This month</Header.Content>
    </Header>
        <Statistic className='stat-container'>
        <Statistic.Value>8700$</Statistic.Value>
          <Statistic.Label><span>Revenue</span></Statistic.Label>
        </Statistic>
      
      
        <Statistic className='stat-container'>
        <Statistic.Value>6</Statistic.Value>
          <Statistic.Label><span>Orders</span></Statistic.Label>
        </Statistic>
      
    </Statistic.Group>
  </Segment>
);

export default StatisticExampleValue;
