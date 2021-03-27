import React, { Fragment, useLayoutEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_microchart from '@amcharts/amcharts4/themes/microchart';
import { observer } from 'mobx-react-lite';
import format from 'date-fns/format';
am4core.useTheme(am4themes_microchart);

interface IProps {
  data:
    | { name: Date; leads: number; opportunities: number }[]
    | { name: string; leads: number; opportunities: number }[];
  loading: boolean;
}

const OpportunitiesChart: React.FC<IProps> = (props) => {
  useLayoutEffect(() => {
    var chart = am4core.create('opportunitiesChart', am4charts.XYChart);
    chart.data = props.data;

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // valueAxis.tooltip!.disabled = true;

    // props.data.forEach((x:any)=>x.name = format(x.name, 'd MMMM'))
    chart.dateFormatter.dateFormat = 'yyyy-MM-dd';
    dateAxis.dateFormatter = new am4core.DateFormatter();
    dateAxis.dateFormatter.dateFormat = 'MM-dd';

    var series = chart.series.push(new am4charts.LineSeries());
    dateAxis.renderer.labels.template.disabled = false;
    // dateAxis.renderer.labels.template.disabled = false;
    dateAxis.renderer.labels.template.fill = am4core.color('#A0CA92');
    dateAxis.renderer.labels.template.location = -0.5;
    valueAxis.renderer.labels.template.fontSize = 30;

    series.dataFields.dateX = 'name';
    series.dataFields.openValueY = 'leads';
    series.dataFields.valueY = 'opportunities';
    series.tooltipText =
      'Leads: {openValueY.value} Opportunities: {valueY.value}';
    series.stroke = chart.colors.getIndex(6);
    series.sequencedInterpolation = true;
    series.defaultState.transitionDuration = 1000;
    series.tensionX = 0.8;
    series.fillOpacity = 1;

    var series2 = chart.series.push(new am4charts.LineSeries());

    series2.dataFields.dateX = 'name';
    series2.dataFields.valueY = 'opportunities';
    series2.sequencedInterpolation = true;
    series2.defaultState.transitionDuration = 1500;
    series2.stroke = chart.colors.getIndex(10);
    series2.tensionX = 0.8;
    series2.fillOpacity = 0.1;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;

    series.tooltip!.label.fontWeight = '700';
    series2.tooltip!.label.fontWeight = '700';
    series.tooltip!.autoTextColor = false;
    series.tooltip!.label.fill = am4core.color('#ffd60a');
    // series2.tooltip!.label.fill = am4core.color('#ffd60a');
    return () => {
      chart.dispose();
    };
  }, [props.data]);

  return (
    <Fragment>
      <div
        id="opportunitiesChart"
        style={{ width: '100%', height: '100%' }}
      ></div>
    </Fragment>
  );
};

export default OpportunitiesChart;
