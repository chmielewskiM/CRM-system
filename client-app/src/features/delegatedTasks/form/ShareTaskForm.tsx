import React, { useEffect } from 'react';
import { Form, Segment, Button, Modal, Header } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Form as FinalForm } from 'react-final-form';
import { IDelegatedTaskForm } from '../../../app/models/delegatedTask';
import { combineValidators, isRequired } from 'revalidate';
import { useStores } from '../../../app/stores/rootStore';
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
  const { delegatedTaskStore, userStore } = useStores();

  useEffect(() => {}, [userStore.usersByName, userStore.selectedUser]);

  const handleFinalFormSubmit = (values: any) => {userStore.getUser('none')};

  if (delegatedTaskStore.loadingInitial)
    return <LoaderComponent content="Loading..." />;

  return (
    <Segment clearing>
      <Modal open>
        <Modal.Content>
          <Segment clearing size="big">
            <Header
              as="h2"
              content="Share task with:"
              style={{ color: '#fff' }}
            />
            <FinalForm
              validate={validation}
              onSubmit={handleFinalFormSubmit}
              render={({ handleSubmit }) => (
                <Form onSubmit={handleSubmit} size="big">
                  <Form.Select
                    options={userStore.usersByName}
                    name="type"
                    placeholder="Select user"
                    value={userStore.selectedUser.username}
                    onClick={() => {
                      userStore.getUserList(true);
                    }}
                    onChange={(e, data) => {
                      userStore.getUser(data.value!.toString());
                    }}
                  />
                  <Button
              negative
              floated="right"
              type="button"
              size="big"
              content="Cancel"
              onClick={() => delegatedTaskStore.setShowShareTaskForm(false)}
            />
            <Button
              positive
              floated="right"
              type="submit"
              size="big"
              content="Confirm"
              onClick={() =>
                delegatedTaskStore.shareTask(
                  delegatedTaskStore.selectedTask!.id,
                  userStore.selectedUser
                )
              }
              loading={delegatedTaskStore.submitting}
            />
                </Form>
              )}
            />
            
          </Segment>
        </Modal.Content>
      </Modal>
    </Segment>
  );
};

export default observer(DelegatedTaskForm);
