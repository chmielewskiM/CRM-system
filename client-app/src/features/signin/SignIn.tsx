import React from 'react';
import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Image,
  Segment,
} from 'semantic-ui-react';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../app/common/form/TextInput';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../app/stores/rootStore';
import { IUserFormValues } from '../../app/models/user';
import { FORM_ERROR } from 'final-form';

// const validate = combineValidators({
//   username: isRequired('username'),
//   password: isRequired('password'),
// });

export const SignIn = () => {
  const { userStore } = useStores();

  return (
    <Grid
      textAlign="center"
      style={{
        height: '100vh',
        width: '100%',
      }}
      verticalAlign="middle"
      className="grid-login"
    >
      <Grid.Column
        style={{
          maxWidth: 450,
        }}
      >
        <Image size="small" centered src="/assets/logo.png" alt="logo" />
        <Header as="h2" size="huge" color="teal" textAlign="center">
          SteelBay
        </Header>
        <FinalForm
          onSubmit={(values: IUserFormValues) =>
            userStore.login(values).catch((error) => ({
              [FORM_ERROR]: error,
            }))
          }
          // validate={validate}
          render={({
            handleSubmit,
            invalid,
            pristine,
            dirtySinceLastSubmit,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Segment raised>
                <Field
                  fluid
                  icon="user"
                  iconPosition="left"
                  name="username"
                  placeholder="Username"
                  component={TextInput}
                />
                <Field
                  fluid
                  icon="lock"
                  iconPosition="left"
                  name="password"
                  placeholder="Password"
                  type="password"
                  component={TextInput}
                />

                <Button
                  positive
                  color="teal"
                  fluid
                  size="large"
                  disabled={(invalid && !dirtySinceLastSubmit) || pristine}
                  type="submit"
                >
                  <Icon name="key" />
                  Log In
                </Button>
              </Segment>
            </Form>
          )}
        ></FinalForm>
      </Grid.Column>
    </Grid>
  );
};

export default observer(SignIn);
