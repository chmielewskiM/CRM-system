import React, { Fragment, useLayoutEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_microchart from '@amcharts/amcharts4/themes/microchart';
import { observer } from 'mobx-react-lite';
am4core.useTheme(am4themes_microchart);

interface IProps {
  data:
    | { name: Date; value: number; value2: number }[]
    | { name: string; value: number; value2: number }[];
}

const OpportunitiesChart: React.FC<IProps> = (props) => {
  useLayoutEffect(() => {
    var chart = am4core.create('opportunitiesChart', am4charts.XYChart);
    chart.data = props.data;
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip!.disabled = true;

    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = 'name';
    series.dataFields.openValueY = 'value';
    series.dataFields.valueY = 'value2';
    series.tooltipText =
      'Leads: {openValueY.value} Opportunities: {valueY.value} Month:{dateX.value}';
    series.stroke = chart.colors.getIndex(6);
    series.sequencedInterpolation = true;
    series.defaultState.transitionDuration = 1000;
    series.tensionX = 0.8;
    series.fillOpacity = 1;

    var series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.dateX = 'name';
    series2.dataFields.valueY = 'value';
    series2.sequencedInterpolation = true;
    series2.defaultState.transitionDuration = 1500;
    series2.stroke = chart.colors.getIndex(10);
    series2.tensionX = 0.8;
    series2.fillOpacity = 0.1;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;

    return () => {
      chart.dispose();
    };
  }, [props.data]);

  return (
    <Fragment>
      <div id="opportunitiesChart" style={{ width: '100%', height: '80%' }}></div>
    </Fragment>
  );
};

export default OpportunitiesChart;
