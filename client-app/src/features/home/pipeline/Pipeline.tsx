import React, { Fragment, ReactElement } from 'react';
import { FunnelChart, Tooltip, Funnel, LabelList, TrapezoidProps, ResponsiveContainer } from 'recharts';
import { observer } from 'mobx-react-lite';

const data = [
  {
    value: 100,
    name: 'Lead',
    fill: '#3a1772',
  },
  {
    value: 80,
    name: 'Opportunity',
    fill: '#16c79a',
  },
  {
    value: 50,
    name: 'Quote',
    fill: '#087e8b',
  },
  {
    value: 40,
    name: 'Invoice',
    fill: '#fbff00',
  },
  {
    value: 26,
    name: 'Converted',
    fill: '#c81d25',
  },
];
const shape: TrapezoidProps = {};

export const Pipeline = () => {
  return (
    <Fragment>
      <ResponsiveContainer className="pipeline-container">
        <FunnelChart>
          <Tooltip payload={data} />
          <Funnel
            dataKey="value"
            data={data}
            isAnimationActive={true}
            activeShape={shape}
          ></Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </Fragment>
  );
};
export default observer(Pipeline);
