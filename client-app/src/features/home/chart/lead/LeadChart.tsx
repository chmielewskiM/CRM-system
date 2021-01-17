import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import React, { Fragment } from 'react';

const data = [
  { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
  { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
  { name: 'Page A', uv: 200, pv: 2400, amt: 2400 },
  { name: 'Page A', uv: 300, pv: 2400, amt: 2400 },
];

const LeadChart = () => {
  return (
    <Fragment>
      <ResponsiveContainer className="chart-container" aspect={1.5}>
        <LineChart data={data}>
          <Line type="monotone" dataKey="uv" stroke="#8884d8" fill="#fff" />
          <CartesianGrid stroke="#fff" />
          <XAxis dataKey="name" fill="#fff" />
          <YAxis fill="#fff" />
        </LineChart>
      </ResponsiveContainer>
      {/* fill="#db3a34" */}
    </Fragment>
  );
};

export default LeadChart;
