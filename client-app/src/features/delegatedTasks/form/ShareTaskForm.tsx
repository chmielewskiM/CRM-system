import React, { useState, useContext, useEffect } from 'react';
import { Form, Segment, Button, Modal } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { observer } from 'mobx-react-lite';
import { Form as FinalForm, Field } from 'react-final-form';
import { IDelegatedTaskForm, DelegatedTaskFormValues } from '../../../app/models/delegatedTask';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import SelectInput from '../../../app/common/form/SelectInput';
import { options } from '../../../app/common/options/delegatedTaskType';
import DateInput from '../../../app/common/form/DateInput';
import { combineDateAndTime } from '../../../app/common/util/util';
import { combineValidators, isRequired } from 'revalidate';
import { RootStoreContext } from '../../../app/stores/rootStore';
import LoaderComponent from '../../../app/layout/LoaderComponent';

const validation = combineValidators({
  // type: isRequired({ message: 'Select type of the task.' }),
  // date: isRequired({ message: 'The date is required.' }),
  // time: isRequired({ message: 'The time is required.' }),
});

interface IProps {
  delegatedTask: IDelegatedTaskForm | undefined;
}

export const DelegatedTaskForm: React.FC<IProps> = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadingInitial,
    setShowDelegatedTaskForm,
    editTask,
    addDelegatedTask,
    submitting,
    fillForm,
    setShowShareTaskForm,
    selectedTask,
    shareTask
  } = rootStore.delegatedTaskStore;

  const {
    usersByName,
    getUser,
    user,
    getLoggedUser,
    getUserList,
    selectedUser,
    rr
  } = rootStore.userStore;

  useEffect(() => {}, [setShowShareTaskForm, rr]);

  const handleFinalFormSubmit = (values: any) => {
      console.log(values)
  }
  if (loadingInitial) return <LoaderComponent content="Loading..." />;
  return (
    <Segment clearing>
      <Modal open>
        <Modal.Content>
          <Segment clearing size="big">
            <FinalForm
              validate={validation}
              onSubmit={handleFinalFormSubmit}
              render={({ handleSubmit }) => (
                <Form onSubmit={handleSubmit} size="big">
                  <Form.Select
                    options={usersByName}
                    name="type"
                    placeholder="Select user"
                    value={selectedUser.username}
                    onClick={() => {
                      getUserList(true);
                    }}
                    onChange={(e, data) => {
                      getUser(data.value!.toString());
                    }}
                  />
                </Form>
              )}
            />
            <Button
                    negative
                    floated="right"
                    type="button"
                    size="big"
                    content="Cancel"
                    onClick={() => setShowShareTaskForm(false)}
                    // loading={submitting}
                    // disabled={loading}
                  />
                  <Button
                    positive
                    floated="right"
                    type="submit"
                    size="big"
                    content="Confirm"
                    loading={submitting}
                    onClick={() => shareTask(selectedTask!.id, selectedUser)}
                    // disabled={loading}
                  />
          </Segment>
        </Modal.Content>
      </Modal>
    </Segment>
  );
};

export default observer(DelegatedTaskForm);
