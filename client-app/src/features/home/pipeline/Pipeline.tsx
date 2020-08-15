import React from 'react';
import { Icon, Segment, Step } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';

export const Pipeline = () => (
  <Segment>
    <Step.Group attached="top">
      <Step>
        <Icon name="truck" />
        <Step.Content>
          <Step.Title>Shipping</Step.Title>
          <Step.Description>Choose your shipping options</Step.Description>
        </Step.Content>
      </Step>

      <Step active>
        <Icon name="payment" />
        <Step.Content>
          <Step.Title>Billing</Step.Title>
          <Step.Description>Enter billing information</Step.Description>
        </Step.Content>
      </Step>

      <Step disabled>
        <Icon name="info" />
        <Step.Content>
          <Step.Title>Confirm Order</Step.Title>
        </Step.Content>
      </Step>
    </Step.Group>
  </Segment>
);

export default observer(Pipeline);
