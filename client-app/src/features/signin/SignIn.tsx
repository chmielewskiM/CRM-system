import React from 'react';
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export const SignIn = () => (
  <Grid
    textAlign="center"
    style={{
      height: '100vh',
    }}
    verticalAlign="middle"
  >
    <Grid.Column
      style={{
        maxWidth: 450,
      }}
    >
      <Image fluid size="small" centered src="/assets/logo.png" alt="logo" />
      <Header as="h2" size="huge" color="teal" textAlign="center">
        SteelBay
      </Header>
      <Form size="massive">
        <Segment raised size="huge">
          <Form.Input
            fluid
            icon="user"
            iconPosition="left"
            placeholder="User"
          />
          <Form.Input
            fluid
            icon="lock"
            iconPosition="left"
            placeholder="Password"
            type="password"
          />
          <Button color="teal" fluid size="large" as={Link} to="/home">
            Log In
          </Button>
        </Segment>
      </Form>
    </Grid.Column>
  </Grid>
);

export default SignIn;
