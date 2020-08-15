import React, { useState, useContext, useEffect, Fragment } from 'react';
import { Form, Segment, Button, Modal, Label } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { observer } from 'mobx-react-lite';
import { Form as FinalForm, Field } from 'react-final-form';
import { IOrderForm, OrderFormValues } from '../../../app/models/order';
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import SelectInput from '../../../app/common/form/SelectInput';
import { combineValidators, isRequired } from 'revalidate';
import { material } from '../../../app/common/options/product';
import NumberInput from '../../../app/common/form/NumberInput';
import RadioInput from '../../../app/common/form/RadioInput';
import { RootStoreContext } from '../../../app/stores/rootStore';

const validation = combineValidators({
  client: isRequired({ message: 'Choose who should perform the task.' }),
  // type: isRequired({ message: 'Choose who should perform the task.' }),
  // product: isRequired({ message: 'Select type of the task.' }),
  // amount: isRequired({ message: 'Select type of the task.' }),
  // price: isRequired({ message: 'Select type of the task.' }),
});

interface IProps {
  order: IOrderForm | undefined;
}

export const OrderForm: React.FC<IProps> = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    setShowOrderForm,
    editOrder,
    addOrder,
    submitting,
    fillForm,
    selectedValue,
  } = rootStore.orderStore;

  useEffect(() => {}, [setShowOrderForm]);

  const [order, setOrder] = useState(new OrderFormValues());
  const [loading, setLoading] = useState(false);

  const handleFinalFormSubmit = (values: any) => {
    const { ...order } = values;
    if (!order.id) {
      let newOrder = {
        ...order,
        id: uuid(),
      };
      addOrder(newOrder);
    } else {
      editOrder(order);
    }
  };

  return (
    <Segment clearing>
      <Modal open>
        <Modal.Content>
          <Segment clearing size="big">
            <FinalForm
              validate={validation}
              initialValues={fillForm()}
              onSubmit={handleFinalFormSubmit}
              render={({
                handleSubmit,
                invalid,
                pristine,
                form,
                values,
                touched,
              }) => (
                <Form onSubmit={handleSubmit} size="big">
                  <Field
                    name="client"
                    placeholder="Client"
                    value={order.client}
                    component={TextInput}
                  />
                  <Form.Group inline>
                    <Label>Sale</Label>
                    <Field
                      name="sale"
                      label="Sale"
                      value={selectedValue}
                      type="radio"
                      component={RadioInput}
                    />
                    {''}
                    <Label>Purchase</Label>
                    <Field
                      name="sale"
                      label="Purchase"
                      value={!selectedValue}
                      type="radio"
                      component={RadioInput}
                    />
                    {''}
                  </Form.Group>
                  {selectedValue == false && (
                    <Fragment>
                      <Form.Group>
                        <Field
                          options={material}
                          name="type"
                          placeholder="Type"
                          value={order.notes}
                          component={SelectInput}
                        />
                        <Field
                          name="amount"
                          placeholder="Amount"
                          component={NumberInput}
                        />
                        <Field
                          name="price"
                          placeholder="Price"
                          component={NumberInput}
                        />
                      </Form.Group>
                    </Fragment>
                  )}
                  {selectedValue != false && (
                    <Fragment>
                      <Form.Group>
                        <Field
                          name="length"
                          placeholder="Length"
                          component={NumberInput}
                        />
                        <Field
                          name="diameter"
                          placeholder="Diameter"
                          component={NumberInput}
                        />
                        <Field
                          options={material}
                          name="type"
                          placeholder="Type"
                          value={order.notes}
                          component={SelectInput}
                        />
                        <Field
                          name="amount"
                          placeholder="Amount"
                          component={NumberInput}
                        />
                        <Field
                          name="price"
                          placeholder="Price"
                          component={NumberInput}
                        />
                      </Form.Group>
                    </Fragment>
                  )}

                  <Field
                    name="notes"
                    placeholder="Notes"
                    value={order.notes}
                    component={TextAreaInput}
                  />

                  <Button
                    negative
                    floated="right"
                    type="button"
                    size="big"
                    content="Cancel"
                    onClick={() => setShowOrderForm(false)}
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

export default observer(OrderForm);
