import React, { useContext } from 'react'
import { Grid, Button } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import ContactStore from '../../../app/stores/contactStore'
import OrderStore from '../../../app/stores/orderStore'
import StockStore from '../../../app/stores/stockStore'
import { StockList } from './StockList'
import { MaterialForm } from '../form/MaterialForm'

export const StockDashboard: React.FC = () => {

    const contactStore = useContext(ContactStore);
    const orderStore = useContext(OrderStore);
    const stockStore = useContext(StockStore);

    const { 
    } = contactStore;

    const { 
    } = orderStore;

    const { selectMaterial,
        selectedMaterial,
        addMaterialForm,
        addMaterial,
        editMaterialForm,
        editMaterial,
        deleteMaterial, 
        showMaterialForm, 
        setShowMaterialForm,
        submitting
    } = stockStore;

    return (
        <Grid stackable centered divided='vertically'>
            {showMaterialForm && <MaterialForm
                key={(selectedMaterial && selectedMaterial.id) || 0}
                material={selectedMaterial!}
            />}
            <Grid.Row>
                <Grid.Column width={2}>
                    <Button positive content='Add material'
                        onClick={addMaterialForm}></Button>
                    <Button content='Deposit log'
                        color={'yellow'}>
                    </Button>
                    {selectedMaterial &&
                        <Button content='Edit material'
                            color={'blue'}
                            onClick={() => editMaterialForm(selectedMaterial.id)}></Button>}
                    {selectedMaterial &&
                        <Button negative content='Delete material'
                            onClick={() => deleteMaterial(selectedMaterial.id)}></Button>}
                </Grid.Column>
                <Grid.Column width={10}>
                    <StockList />
                </Grid.Column>

            </Grid.Row>
        </Grid>
    )
}

export default observer(StockDashboard);
