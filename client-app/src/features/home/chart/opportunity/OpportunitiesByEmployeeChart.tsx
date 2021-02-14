// import React, { PureComponent } from 'react';
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';

// const data = [
//   {
//     name: 'Page A',
//     uv: 4000,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: 'Page B',
//     uv: 3000,
//     pv: 1398,
//     amt: 2210,
//   },
//   {
//     name: 'Page C',
//     uv: 2000,
//     pv: 9800,
//     amt: 2290,
//   },
//   {
//     name: 'Page D',
//     uv: 2780,
//     pv: 3908,
//     amt: 2000,
//   },
//   {
//     name: 'Page E',
//     uv: 1890,
//     pv: 4800,
//     amt: 2181,
//   },
//   {
//     name: 'Page F',
//     uv: 2390,
//     pv: 3800,
//     amt: 2500,
//   },
//   {
//     name: 'Page G',
//     uv: 3490,
//     pv: 4300,
//     amt: 2100,
//   },
// ];

// interface IProps {
//   xAxis: { name:string,value:number,value2:number}[];
// }

// const OpportunityByEmployeeChart: React.FC<IProps> = (props) => {

//     return (
//       <ResponsiveContainer className="chart-container" aspect={1.5}>
//         <AreaChart width={500} height={400} data={props.xAxis}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Area type="monotone" dataKey="value" stackId="1" stroke="#8884d8" fill="#8884d8" />
//           <Area type="monotone" dataKey="value2" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
//           <Area type="monotone" dataKey="amt" stackId="1" stroke="#ffc658" fill="#ffc658" />
//         </AreaChart>
//       </ResponsiveContainer>
//     );

// }

// export default OpportunityByEmployeeChart;
import React, { Fragment, useLayoutEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_microchart from '@amcharts/amcharts4/themes/microchart';
import { observer } from 'mobx-react-lite';
am4core.useTheme(am4themes_microchart);

interface IProps {
  data:
    | { name: string; value: number; value2: number }[]
    | { name: Date; value: number; value2: number }[];
}

const OpportunityByEmployeeChart: React.FC<IProps> = (props) => {
  useLayoutEffect(() => {
    var chart = am4core.create('opportunitiesByEmployeeChart', am4charts.XYChart);
    chart.data = props.data;
    console.log(props.data);

    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'name';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = 'Count';

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'value';
    series.dataFields.categoryX = 'name';
    series.name = 'Leads';
    series.tooltipText = '{name} leads: [bold]{valueY}[/]';
    series.stacked = true;

    var series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.dataFields.valueY = 'value2';
    series2.dataFields.categoryX = 'name';
    series2.name = 'Opportunities';
    series2.tooltipText = '{name} opportunities: [bold]{valueY}[/]';
    series2.stacked = true;

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    return () => {
      chart.dispose();
    };
  }, [props.data]);

  return (
    <Fragment>
      <div id="opportunitiesByEmployeeChart" style={{ width: '100%', height: '80%' }}></div>
    </Fragment>
  );
};

export default OpportunityByEmployeeChart;
