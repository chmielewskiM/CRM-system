import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import React, { Fragment } from 'react';

const data = [
  { name: 'Page A', uv: 400, pv: 100, amt: 2400 },
  { name: 'Page A', uv: 400, pv: 2400, amt: 400 },
  { name: 'Page A', uv: 200, pv: 240, amt: 400 },
  { name: 'Page A', uv: 300, pv: 2400, amt: 2400 },
];
interface IProps {
  data: {
    leads: number;
    opportunities: number;
    conversions: number;
    orders: number;
    revenue: number;
    // source: string;
  };
  xAxis: { name: string }[];
}
const LeadChart: React.FC<IProps> = (props) => {
  return (
    <Fragment>
      <ResponsiveContainer className="chart-container" aspect={1.5}>
        <LineChart data={props.xAxis}>
          <Line type="monotone" dataKey="uv" stroke="#8884d8" fill="#fff" />
          <CartesianGrid stroke="#fff" />
          <XAxis dataKey='name' fill="#fff" scale="utc" tickCount={6}/>
          <YAxis fill="#fff" />
        </LineChart>
      </ResponsiveContainer>
      {/* fill="#db3a34" */}
    </Fragment>
  );
};

export default LeadChart;
