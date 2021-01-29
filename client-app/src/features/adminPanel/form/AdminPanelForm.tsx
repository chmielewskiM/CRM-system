import React, { useState, useContext, useEffect, Fragment } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../../app/common/form/TextInput';
import { combineValidators, isRequired } from 'revalidate';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { UserFormValues } from '../../../app/models/user';

const validation = combineValidators({
  name: isRequired({ message: 'The name is required.' }),
  // type: isRequired({ message: 'Choose who should perform the task.' }),
  // company: isRequired({ message: 'Select type of the task.' }),
  // phoneNumber: isRequired({ message: 'The date is required.' }),
  // email: isRequired({ message: 'The time is required.' }),
  // notes: isRequired({ message: 'The time is required.' }),
});

interface IProps {
  form: boolean;
  value: string;
}

export const AdminPanelForm: React.FC<IProps> = (props) => {
  const rootStore = useContext(RootStoreContext);
  const { getUser, getUserList, usersByName, selectedUser, rr } = rootStore.userStore;
  const { handleFinalFormSubmit } = rootStore.adminStore;

  useEffect(() => {
    setUser(selectedUser);
  }, [rr]);

  const [user2, setUser] = useState(new UserFormValues());

  const fillForm = () => {
    if (selectedUser) {
      return selectedUser;
    } else {
      setUser(new UserFormValues());
      return new UserFormValues();
    }
  };
  return (
    <Fragment>
      <FinalForm
        validate={validation}
        onSubmit={handleFinalFormSubmit}
        initialValues={fillForm()}
        render={({ handleSubmit }) => (
          <Form onSubmit={handleSubmit} size="big" id="form">
            {!props.form && (
              <Form.Select
                options={usersByName}
                name="type"
                placeholder="Select user"
                value={user2?.username}
                onClick={() => {
                  getUserList();
                }}
                onChange={(e, data) => {
                  getUser(data.value!.toString());
                }}
              />
            )}

            <Field
              name="username"
              placeholder="Username"
              value={user2?.username}
              component={TextInput}
            />
            <Field
              name="password"
              placeholder="Password"
              value={user2?.password}
              component={TextInput}
            />
            <Field
              name="level"
              placeholder="Display name"
              value={user2?.level}
              component={TextInput}
            />
            <Field
              name="email"
              placeholder="E-mail address"
              value="{user2.email}"
              component={TextInput}
            />

            <Button.Group>
              <Button negative floated="right" type="button" size="big" content="Cancel" />
              <Button positive floated="right" type="submit" size="big" content="Confirm" />
            </Button.Group>
          </Form>
        )}
      />
    </Fragment>
  );
};

export default observer(AdminPanelForm);
