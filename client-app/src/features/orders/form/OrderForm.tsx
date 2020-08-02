import React, { useState, FormEvent, useContext, SyntheticEvent } from 'react'
import { Form, Segment, TextArea, Select, Input, Button, Modal } from 'semantic-ui-react'
import { v4 as uuid } from 'uuid';
import { observer } from 'mobx-react-lite';
import OrderStore from '../../../app/stores/orderStore'
import ContactStore from '../../../app/stores/contactStore'
import { IOrder } from '../../../app/models/order';
import { ToastContainer } from 'react-toastify';

interface IProps {
    order: IOrder | undefined;
}


export const OrderForm: React.FC<IProps> = ({
    order: initialFormState,
}) => {

    const contactStore = useContext(ContactStore);
    const orderStore = useContext(OrderStore);
    
    const { selectedContact,  submitting, addContact, editContact, updateFormSelect} = contactStore;
    const { showOrderForm, setShowOrderForm, selectedOrder, addOrder, editOrder } = orderStore;

    const fillForm = () => {
        if (selectedOrder) {
            // setValue(selectedContact.type)
            return selectedOrder
        } else {
            return {
                id: '',
                client: '',
                product: '',
                amount:0,
                price:0,
                dateOrderOpened: '',
                deadline: '',
                dateOrderClosed: '',
                notes:''
            }
        }
    };
    
    const [value, setValue] = useState('');
    const [order, setOrder] = useState<IOrder>(fillForm);

    const handleSubmit = () => {
        if (order.id.length === 0) {
            let newOrder = {
                ...order,
                id: uuid()
            }
            addOrder(newOrder);
        } else {
            editOrder(order);
        }

    }

    var options:any= [];


        // contactStore.contactRegistry.forEach((id) => {
        //     options.push({ label:contactStore.contactRegistry.get(id), value: contactStore.contactRegistry.values()})
        // });
    
        
        

    const handleInputChange = (event: FormEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget;
        setOrder({ ...order, [name]: value });
    }

    const handleSelect = (event: SyntheticEvent<HTMLElement, Event>) => {
        setValue(event.currentTarget.innerText);
        event.currentTarget.classList.add('Selected');
        updateFormSelect(event.currentTarget.innerText);
    }

    return (

        <Segment clearing>
            <Modal
                as={Form}
                open={true}
            >
                
                <Modal.Content>
                    <Segment clearing size='big'>
                        <Form onSubmit={handleSubmit} size='big'>
                            <Form.Field
                                onChange={handleInputChange}
                                id='form-input-control-first-name'
                                control={Input}
                                name='client'
                                label='Client'
                                placeholder='Client'
                                value={order.client}
                            />
                            <Form.Select
                                onChange={handleSelect}
                                id='form-input-control-last-name'
                                control={Select}
                                options={options}
                                name='type'
                                label='Type'
                                placeholder='Type'
                                value={value}
                            />
                            <Form.Field
                                onChange={handleInputChange}
                                id='form-input-control-last-name'
                                control={Input}
                                name='product'
                                label='Product'
                                placeholder='Product'
                                value={order.product}
                            />
                            <Form.Field
                                onChange={handleInputChange}
                                id='form-input-control-last-name'
                                control={Input}
                                name='amount'
                                label='Amount'
                                placeholder='Amount'
                                value={order.amount}
                            />
                            <Form.Field
                                onChange={handleInputChange}
                                id=''
                                control={Input}
                                name='price'
                                label='Price'
                                placeholder='Price'
                                value={order.price}
                            />
                            <Form.Field
                                onChange={handleInputChange}
                                id='form-input-control-error-email'
                                control={TextArea}
                                name='deadline'
                                label='Deadline'
                                placeholder='Deadline'
                                value={order.deadline}
                            />
                            <Form.Field
                                onChange={handleInputChange}
                                id='form-textarea-control-opinion'
                                control={TextArea}
                                name='notes'
                                label='Notes'
                                placeholder='Notes'
                                value={order.notes}
                            />

                            <Button negative floated='right' type='button' size='big' content='Cancel'
                                onClick={() =>
                                    setShowOrderForm(false)}
                            >
                            </Button>
                            <Button positive floated='right' type='submit' size='big' content='Confirm'
                                loading={submitting}
                            >
                            </Button>

                        </Form>
                    </Segment>
                </Modal.Content>
            </Modal>
        </Segment>
    )
}

export default observer(OrderForm);