import React, { useContext, useEffect } from 'react';
import { Form, Segment, Button, Modal, Header } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Form as FinalForm } from 'react-final-form';
import { combineValidators } from 'revalidate';
import { RootStoreContext } from '../../../app/stores/rootStore';
import LoaderComponent from '../../../app/layout/LoaderComponent';

const validation = combineValidators({
  // type: isRequired({ message: 'Select type of the task.' }),
  // date: isRequired({ message: 'The date is required.' }),
  // time: isRequired({ message: 'The time is required.' }),
});

export const ShareContactForm: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadingInitial,
    submitting,
    showShareContactForm,
    selectedContact,
    shareContact,
  } = rootStore.contactStore;

  const {
    usersByName,
    getUser,
    getUserList,
    selectedUser,
    rr,
  } = rootStore.userStore;

  useEffect(() => {}, []);

  const handleFinalFormSubmit = (values: any) => {
  };
  if (loadingInitial) return <LoaderComponent content="Loading..." />;
  return (
    <Segment clearing>
      <Modal open>
        <Modal.Content>
          <Segment clearing size="big">
            <Header
              as="h2"
              content="Share contact with:"
              style={{ color: '#fff' }}
            />
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
                  <Button
                    negative
                    floated="right"
                    type="button"
                    size="big"
                    content="Cancel"
                    onClick={() => showShareContactForm(false)}
                    loading={submitting}
                    disabled={submitting}
                  />
                  {selectedUser != undefined && (
                    <Button
                      positive
                      floated="right"
                      type="submit"
                      size="big"
                      content="Confirm"
                      onClick={() =>
                        shareContact(selectedContact!.id, selectedUser)
                      }
                      loading={submitting}
                      disabled={submitting}
                    />
                  )}
                  {selectedUser == undefined && (
                    <Button
                      positive
                      floated="right"
                      size="big"
                      content="Select contact"
                      disabled={true}
                    />
                  )}
                </Form>
              )}
            />
          </Segment>
        </Modal.Content>
      </Modal>
    </Segment>
  );
};

export default observer(ShareContactForm);
