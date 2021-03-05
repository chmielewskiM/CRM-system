import React, { useState, useContext, useEffect, Fragment } from 'react';
import { Form, Segment, Button, Modal, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Form as FinalForm, Field } from 'react-final-form';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import SelectInput from '../../../app/common/form/SelectInput';
import { combineValidators, isRequired } from 'revalidate';
import { material, products } from '../../../app/common/options/product';
import NumberInput from '../../../app/common/form/NumberInput';
import RadioInput from '../../../app/common/form/RadioInput';
import { RootStoreContext } from '../../../app/stores/rootStore';

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
  const rootStore = useContext(RootStoreContext);
  const {
    setShowOrderForm,
    editOrder,
    addOrder,
    submitting,
    fillForm,
    sale,
    handleFinalFormSubmit,
    selectedOrder,
    toggleSelect,
  } = rootStore.orderStore;
  const { contactsByName, selectedContact, loadContacts, getContact } = rootStore.contactStore;

  useEffect(() => {
    loadContacts();
  }, [addOrder, editOrder]);

  return (
    <Segment clearing>
      <Modal open>
        <Modal.Content>
          <Segment clearing size="big" className={props.className}>
            <FinalForm
              validate={validation}
              initialValues={fillForm()}
              onSubmit={handleFinalFormSubmit}
              render={({ handleSubmit }) => (
                <Form onSubmit={handleSubmit} size="big">
                  <Form.Select
                    options={contactsByName}
                    name="client"
                    placeholder="Select client"
                    value={selectedContact?.name}
                    onClick={() => {}}
                    onChange={(e, data) => {
                      getContact(data.value!.toString());
                      loadContacts();
                    }}
                  />
                  <Form.Group inline className="btn-group-1">
                    <Label>Sale</Label>
                    <Field
                      name="sale"
                      label="Sale"
                      value={sale}
                      type="radio"
                      component={RadioInput}
                      func={() => toggleSelect(sale)}
                    />
                    {''}
                    <Label>Purchase</Label>
                    <Field
                      name="sale"
                      label="Purchase"
                      value={!sale}
                      type="radio"
                      func={() => toggleSelect(sale)}
                      component={RadioInput}
                    />
                    {''}
                    {sale == false && (
                      <Field
                        options={material}
                        className="product"
                        name="product"
                        placeholder="Product"
                        value={selectedOrder?.product}
                        component={SelectInput}
                      />
                    )}
                    {sale != false && (
                      <Field
                        options={products}
                        className="product"
                        name="product"
                        placeholder="Product"
                        value={selectedOrder?.product}
                        component={SelectInput}
                      />
                    )}
                  </Form.Group>
                  {sale == false && (
                    <Fragment>
                      <Form.Group className="btn-group-2">
                        <Label content="Amount (lb)" />
                        <Field
                          className="amount"
                          name="amount"
                          placeholder="Amount"
                          component={NumberInput}
                          value={selectedOrder?.amount}
                        />
                        <Label content="Price" />
                        <Field
                          className="price"
                          name="price"
                          placeholder="Price"
                          component={NumberInput}
                          value={selectedOrder?.price}
                        />
                      </Form.Group>
                    </Fragment>
                  )}
                  {sale != false && (
                    <Fragment>
                      <Form.Group className="btn-group-2">
                        <Label content="Amount (pc)" />
                        <Field
                          className="amount"
                          name="amount"
                          placeholder="Amount"
                          component={NumberInput}
                          value={selectedOrder?.amount}
                        />
                        <Label content="Price" />
                        <Field
                          className="price"
                          name="price"
                          placeholder="Price"
                          component={NumberInput}
                          value={selectedOrder?.price}
                        />
                      </Form.Group>
                    </Fragment>
                  )}

                  <Field
                    className="notes"
                    name="notes"
                    placeholder="Notes"
                    value={selectedOrder?.notes}
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
                    // onClick={handleFinalFormSubmit}
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
