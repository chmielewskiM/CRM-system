import React, { useContext, Fragment } from 'react';
import { Table } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import StockStore from '../../../app/stores/stockStore';

export const StockList: React.FC = () => {
  const stockStore = useContext(StockStore);
  const { selectMaterial, selectedMaterial, materialsByName } = stockStore;

  return (
    <>
      <Table celled selectable sortable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Stock</Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Storehouse</Table.HeaderCell>
            <Table.HeaderCell>Available</Table.HeaderCell>
            <Table.HeaderCell>Deployed</Table.HeaderCell>
            <Table.HeaderCell>Ordered</Table.HeaderCell>
            <Table.HeaderCell>Required</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {materialsByName.map((material) => (
          <Table.Body key={material.id}>
            <Table.Row
              onClick={() => selectMaterial(material.id)}
              active={
                selectedMaterial !== undefined &&
                selectedMaterial.id == material.id
              }
            >
              <Table.Cell>{material.name}</Table.Cell>
              <Table.Cell>{material.storehouse}</Table.Cell>
              <Table.Cell>{material.available}</Table.Cell>
              <Table.Cell>{material.deployed}</Table.Cell>
              <Table.Cell>{material.ordered}</Table.Cell>
              <Table.Cell>{material.required}</Table.Cell>
            </Table.Row>
          </Table.Body>
        ))}
      </Table>
    </>
  );
};
export default observer(StockList);
