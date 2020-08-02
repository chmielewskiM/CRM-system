import React, { useState, FormEvent, useContext, SyntheticEvent } from 'react'
import { Form, Segment, TextArea, Select, Input, Button, Modal } from 'semantic-ui-react'
import { v4 as uuid } from 'uuid';
import { observer } from 'mobx-react-lite';
import StockStore from '../../../app/stores/stockStore'
import ContactStore from '../../../app/stores/contactStore'
import { IMaterial } from '../../../app/models/material';

interface IProps {
    material: IMaterial | undefined;
}


export const MaterialForm: React.FC<IProps> = ({
    material: initialFormState,
}) => {

    const contactStore = useContext(ContactStore);
    const stockStore = useContext(StockStore);

    const {
    } = contactStore;

    const {
        showMaterialForm,
        setShowMaterialForm,
        selectedMaterial,
        addMaterial,
        editMaterial,
        selectedValue,
        selected,
        submitting,
        updateFormSelect
    } = stockStore;

    const fillForm = () => {
        if (selectedMaterial) {
            setValue(selectedMaterial.name)
            return selectedMaterial
        } else {
            return {
                id: '',
                name: '',
                storehouse: '',
                available: 0,
                deployed: 0,
                ordered: 0,
                required: 0,
            }
        }
    };

    const [value, setValue] = useState('');
    const [material, setMaterial] = useState<IMaterial>(fillForm);

    const handleSubmit = () => {
        if (material.id.length === 0) {
            let newMaterial = {
                ...material,
                id: uuid()
            }
            addMaterial(newMaterial);
        } else {
            editMaterial(material);
        }

    }

    var options: any = [];


    // contactStore.contactRegistry.forEach((id) => {
    //     options.push({ label:contactStore.contactRegistry.get(id), value: contactStore.contactRegistry.values()})
    // });




    const handleInputChange = (event: FormEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget;
        setMaterial({ ...material, [name]: value });
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
                            <Form.Select
                                onChange={handleSelect}
                                id='form-input-control-last-name'
                                control={Select}
                                options={options}
                                name='name'
                                label='Name'
                                placeholder='Name'
                                value={value}
                            />
                            <Form.Field
                                onChange={handleInputChange}
                                id='form-input-control-last-name'
                                control={Input}
                                name='storehouse'
                                label='Storehouse'
                                placeholder='Storehouse'
                                value={material.storehouse}
                            />
                            <Form.Field
                                onChange={handleInputChange}
                                id='form-input-control-last-name'
                                control={Input}
                                name='available'
                                label='Available'
                                placeholder='Available'
                                value={material.available}
                            />
                            <Form.Field
                                onChange={handleInputChange}
                                id=''
                                control={Input}
                                name='deployed'
                                label='Deployed'
                                placeholder='Deployed'
                                value={material.deployed}
                            />
                            <Form.Field
                                onChange={handleInputChange}
                                id='form-input-control-error-email'
                                control={TextArea}
                                name='ordered'
                                label='Ordered'
                                placeholder='Ordered'
                                value={material.ordered}
                            />
                            <Form.Field
                                onChange={handleInputChange}
                                id='form-textarea-control-opinion'
                                control={TextArea}
                                name='required'
                                label='Required'
                                placeholder='Required'
                                value={material.required}
                            />

                            <Button negative floated='right' type='button' size='big' content='Cancel'
                                onClick={() =>
                                    setShowMaterialForm(false)}
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

export default observer(MaterialForm);