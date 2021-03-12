import React, { useState, useContext, useEffect } from 'react';
import { Form, Segment, Button, Modal, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Form as FinalForm, Field } from 'react-final-form';
import { IDelegatedTaskForm, DelegatedTaskFormValues } from '../../../app/models/delegatedTask';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import SelectInput from '../../../app/common/form/SelectInput';
import { options } from '../../../app/common/options/delegatedTaskType';
import DateInput from '../../../app/common/form/DateInput';
import { combineDateAndTime } from '../../../app/common/util/util';
import { combineValidators, isRequired, composeValidators } from 'revalidate';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { isAfter } from 'date-fns';
import LoaderComponent from '../../../app/layout/LoaderComponent';

const validation = combineValidators({
  type: isRequired({ message: 'Select type of the task.' }),
  date: isRequired({ message: 'The date is required.' }),
  time: isRequired({ message: 'The time is required.' }),
});

interface IProps {
  delegatedTask: IDelegatedTaskForm | undefined;
  className?: string;
}

export const DelegatedTaskForm: React.FC<IProps> = (props) => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadingInitial,
    setShowDelegatedTaskForm,
    editTask,
    addDelegatedTask,
    submitting,
    fillForm,
    handleFinalFormSubmit,
    formDateValidation,
  } = rootStore.delegatedTaskStore;

  useEffect(() => {}, [setShowDelegatedTaskForm]);

  const [delegatedTask, setDelegatedTask] = useState(new DelegatedTaskFormValues());

  const [loading, setLoading] = useState(false);
  if (loadingInitial) return <LoaderComponent content="Loading..." />;
  return (
    <Segment clearing>
      <Modal open>
        <Modal.Content>
          <Segment clearing size="big" className={props.className}>
            <FinalForm
              validate={validation}
              initialValues={fillForm()}
              onSubmit={handleFinalFormSubmit}
              render={({ handleSubmit, invalid, pristine }) => (
                <Form onSubmit={handleSubmit} size="big">
                  <Form.Group>
                    <Label>Task</Label>
                    <Field
                      options={options}
                      name="type"
                      placeholder="Type"
                      value={delegatedTask.type}
                      component={SelectInput}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Label>Deadline</Label>
                    <Field
                      name="date"
                      placeholder="Date"
                      date={true}
                      value={delegatedTask.date}
                      component={DateInput}
                      minDate={new Date()}
                    />
                    <Field
                      name="time"
                      placeholder="Time"
                      time={true}
                      value={delegatedTask.time}
                      component={DateInput}
                    />
                  </Form.Group>
                  <Field
                    name="notes"
                    placeholder="Notes"
                    value={delegatedTask.notes}
                    component={TextAreaInput}
                  />

                  <Button
                    negative
                    floated="right"
                    type="button"
                    size="big"
                    content="Cancel"
                    onClick={() => setShowDelegatedTaskForm(false)}
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
                    // disabled={loading}
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
