import React, { useEffect, Fragment } from 'react';
import { Form, Segment, Button, Modal, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Form as FinalForm, Field } from 'react-final-form';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import SelectInput from '../../../app/common/form/SelectInput';
import { combineValidators, isRequired } from 'revalidate';
import { material, products } from '../../../app/common/options/product';
import NumberInput from '../../../app/common/form/NumberInput';
import RadioInput from '../../../app/common/form/RadioInput';
import { useStores } from '../../../app/stores/rootStore';
import LoaderComponent from '../../../app/layout/LoaderComponent';

const validation = combineValidators({
  // client: isRequired({ message: 'Choose who should perform the task.' }),
  // type: isRequired({ message: 'Choose who should perform the task.' }),
  // product: isRequired({ message: 'Select type of the task.' }),
  // amount: isRequired({ message: 'Select type of the task.' }),
  // price: isRequired({ message: 'Select type of the task.' }),
});

interface IProps {
  className?: string;
}

export const OrderForm: React.FC<IProps> = (props) => {
  const { orderStore, contactStore } = useStores();

  useEffect(() => {}, [orderStore.sale, contactStore.uncontracted]);

  return (
    <Segment clearing>
      {orderStore.loadingInitial && <LoaderComponent content="Loading..." />}
      <Modal open>
        <Modal.Content>
          <Segment clearing size="big" className={props.className}>
            <FinalForm
              validate={validation}
              initialValues={orderStore.fillForm()}
              onSubmit={orderStore.handleFinalFormSubmit}
              render={({ handleSubmit }) => (
                <Form onSubmit={handleSubmit} size="big">
                  <Form.Select
                    options={contactStore.uncontractedContacts}
                    name="client"
                    placeholder="Select client"
                    value={contactStore.selectedContact?.name}
                    // onClick={contactStore.loadUncontracted}
                    onChange={(e, data) => {
                      contactStore.getContact(data.value!.toString());
                      // contactStore.loadUncontracted();
                    }}
                  />
                  <Form.Group inline className="btn-group-1">
                    <Field
                      name="orderStore.sale"
                      label="Sale"
                      value={orderStore.sale}
                      type="radio"
                      component={RadioInput}
                      func={orderStore.toggleSelect}
                    />
                    {''}
                    <Field
                      name="orderStore.sale"
                      label="Purchase"
                      value={!orderStore.sale}
                      type="radio"
                      func={orderStore.toggleSelect}
                      component={RadioInput}
                    />
                    {''}
                    {orderStore.sale == false && (
                      <Field
                        options={material}
                        className="product"
                        name="product"
                        placeholder="Product"
                        value={orderStore.selectedOrder?.product}
                        component={SelectInput}
                      />
                    )}
                    {orderStore.sale != false && (
                      <Field
                        options={products}
                        className="product"
                        name="product"
                        placeholder="Product"
                        value={orderStore.selectedOrder?.product}
                        component={SelectInput}
                      />
                    )}
                  </Form.Group>
                  {orderStore.sale == false && (
                    <Fragment>
                      <Form.Group className="btn-group-2">
                        <Label content="Amount (lb)" />
                        <Field
                          className="amount"
                          name="amount"
                          placeholder="Amount"
                          component={NumberInput}
                          value={orderStore.selectedOrder?.amount}
                        />
                        <Label content="Price" />
                        <Field
                          className="price"
                          name="price"
                          placeholder="Price"
                          component={NumberInput}
                          value={orderStore.selectedOrder?.price}
                        />
                      </Form.Group>
                    </Fragment>
                  )}
                  {orderStore.sale != false && (
                    <Fragment>
                      <Form.Group className="btn-group-2">
                        <Label content="Amount (pc)" />
                        <Field
                          className="amount"
                          name="amount"
                          placeholder="Amount"
                          component={NumberInput}
                          value={orderStore.selectedOrder?.amount}
                        />
                        <Label content="Price" />
                        <Field
                          className="price"
                          name="price"
                          placeholder="Price"
                          component={NumberInput}
                          value={orderStore.selectedOrder?.price}
                        />
                      </Form.Group>
                    </Fragment>
                  )}

                  <Field
                    className="notes"
                    name="notes"
                    placeholder="Notes"
                    value={orderStore.selectedOrder?.notes}
                    component={TextAreaInput}
                  />

                  <Button
                    negative
                    floated="right"
                    type="button"
                    size="big"
                    content="Cancel"
                    onClick={() => orderStore.setShowOrderForm(false)}
                    // loading={orderStore.submitting}
                    // disabled={loading}
                  />
                  <Button
                    positive
                    floated="right"
                    type="submit"
                    size="big"
                    content="Confirm"
                    loading={orderStore.submitting}
                    // onClick={orderStore.handleFinalFormSubmit}
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
