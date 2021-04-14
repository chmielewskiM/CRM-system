import React, { useState, useEffect, Fragment } from 'react';
import { Form, Button, Segment, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../../app/common/form/TextInput';
import {
  combineValidators,
  hasLengthGreaterThan,
  isRequired,
} from 'revalidate';
import { useStores } from '../../../app/stores/rootStore';
import { UserFormValues } from '../../../app/models/user';
import RadioInput from '../../../app/common/form/RadioInput';

const validation = combineValidators({
  // username: isRequired({ message: 'The username is required.' }),
  // displayName: isRequired({ message: 'Enter name to display.' }),
  // password: hasLengthGreaterThan(8)({
  //   message: 'Password must be at least 8 characters long.',
  // }),
  // company: isRequired({ message: 'Select type of the task.' }),
  // phoneNumber: isRequired({ message: 'The date is required.' }),
  // email: isRequired({ message: 'The time is required.' }),
  // notes: isRequired({ message: 'The time is required.' }),
});

interface IProps {
  form: boolean;
}

export const AdminPanelForm: React.FC<IProps> = (props) => {
  const { adminStore, userStore } = useStores();

  useEffect(() => {
    userStore.getUser('none');
    setUser(userStore.selectedUser);
  }, [props.form, userStore.usersByName]);

  const [level, setLevel] = useState(userStore.selectedUser.level == 'mid');
  const [user, setUser] = useState(userStore.selectedUser);

  const fillForm = (form: boolean) => {
    if (userStore.selectedUser && !form) {
      return user;
    } else {
      return new UserFormValues();
    }
  };

  return (
    <Fragment>
      <FinalForm
        validate={validation}
        onSubmit={() => adminStore.handleFinalFormSubmit}
        initialValues={fillForm(props.form)}
        render={({ handleSubmit, values, form }) => (
          <Form onSubmit={handleSubmit} size="big">
            {!props.form && (
              <Fragment>
                <Label content="User" />
                <Form.Select
                  options={userStore.usersByName}
                  name="user"
                  placeholder="Select user"
                  value={user.username}
                  onChange={(e, data) => {
                    userStore
                      .getUser(data.value!.toString())
                      .then(() => setUser(userStore.selectedUser))
                      .finally(() =>
                        userStore.selectedUser.level == 'mid'
                          ? setLevel(true)
                          : setLevel(false)
                      );
                  }}
                />
              </Fragment>
            )}

            <Label content="Username" />
            <Field
              name="username"
              placeholder="Username"
              value={user.username}
              component={TextInput}
            />

            <Label content="Display name" />
            <Field
              name="displayName"
              placeholder="Display name"
              value={user.displayName}
              component={TextInput}
            />

            <Label content="Password" />
            <Field
              name="password"
              placeholder="Password"
              value={user.password}
              component={TextInput}
            />

            <Segment className="radio-btns">
              <Field
                label="Manager"
                name="level"
                value={level}
                type="radio"
                onChange={() => setLevel(!level)}
                component={RadioInput}
              />

              <Field
                label="Employee"
                name="level"
                value={!level}
                type="radio"
                onChange={() => setLevel(!level)}
                component={RadioInput}
              />
            </Segment>

            <Label content="Email" />
            <Field
              name="email"
              placeholder="E-mail address"
              value={user.email}
              component={TextInput}
            />

            {!props.form && (
              <Button
                negative
                floated="right"
                type="button"
                size="big"
                content="Delete"
                onClick={() => {
                  userStore.deleteUser();
                  form.reset();
                }}
                disabled={user.username == ''}
                loading={userStore.submitting}
              />
            )}

            {props.form && (
              <Button
                positive
                floated="right"
                type="submit"
                size="big"
                content="Add"
                onClick={() => {
                  adminStore.handleFinalFormSubmit(values, level);
                  setUser(new UserFormValues());
                  form.reset();
                }}
                loading={userStore.submitting}
                disabled={userStore.submitting}
              />
            )}
            {!props.form && (
              <Button
                positive
                floated="right"
                type="submit"
                size="big"
                content="Confirm"
                onClick={() => {
                  adminStore.handleFinalFormSubmit(values, level);
                  setUser(new UserFormValues());
                  form.reset();
                }}
                loading={userStore.submitting}
                disabled={userStore.submitting}
              />
            )}
          </Form>
        )}
      />
    </Fragment>
  );
};

export default observer(AdminPanelForm);
