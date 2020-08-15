import React, { useContext } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { StockList } from './StockList';
import { MaterialForm } from '../form/MaterialForm';
import { RootStoreContext } from '../../../app/stores/rootStore';

export const StockDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    selectedMaterial,
    addMaterialForm,
    editMaterialForm,
    deleteMaterial,
    showMaterialForm,
  } = rootStore.stockStore;

  return (
    <Grid stackable centered divided="vertically">
      {showMaterialForm && (
        <MaterialForm
          key={(selectedMaterial && selectedMaterial.id) || 0}
          material={selectedMaterial!}
        />
      )}
      <Grid.Row>
        <Grid.Column width={2}>
          <Button positive content="Add material" onClick={addMaterialForm} />
          <Button content="Deposit log" color="yellow" />
          {selectedMaterial && (
            <Button
              content="Edit material"
              color="blue"
              onClick={() => editMaterialForm(selectedMaterial.id)}
            />
          )}
          {selectedMaterial && (
            <Button
              negative
              content="Delete material"
              onClick={() => deleteMaterial(selectedMaterial.id)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={10}>
          <StockList />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default observer(StockDashboard);
