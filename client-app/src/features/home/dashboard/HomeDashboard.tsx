import React, { useContext } from 'react';
import { Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { Pipeline } from '../pipeline/Pipeline';

export const HomeDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {} = rootStore.stockStore;

  return (
    <Grid stackable centered divided="vertically">
      <Grid.Row>
        <Grid.Column width={16}>
          <Pipeline />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default observer(HomeDashboard);
