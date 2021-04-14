import React, { Fragment, useEffect, useLayoutEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_microchart from '@amcharts/amcharts4/themes/microchart';
import { observer } from 'mobx-react-lite';
import format from 'date-fns/format';
import { Label } from 'semantic-ui-react';
am4core.useTheme(am4themes_microchart);

interface IProps {
  data:
    | { dateStart: Date; dateEnd: Date; leads: number; opportunities: number }[]
    | { name: string; leads: number; opportunities: number }[];
  loading: boolean;
}

const OpportunitiesChart: React.FC<IProps> = (props) => {
  useEffect(() => {}, [props.data]);

  useLayoutEffect(() => {
    var chart = am4core.create('opportunitiesChart', am4charts.XYChart);
    chart.data = props.data;
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    

    // valueAxis.tooltip!.disabled = true;
    dateAxis.dateFormatter = new am4core.DateFormatter();
    dateAxis.title.text = 'Time';
    dateAxis.title.align = 'center';
    dateAxis.title.fontSize='1.6rem';
    dateAxis.title.fill = am4core.color('#fff');
    dateAxis.renderer.labels.template.disabled = true;
    dateAxis.renderer.labels.template.fill = am4core.color('#A0CA92');
    dateAxis.title.dy = 5;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.labels.template.fontSize = 30;
    valueAxis.title.text = 'Count';
    valueAxis.title.align = 'center';
    valueAxis.title.fontSize='1.6rem';
    valueAxis.title.fill = am4core.color('#fff');
    valueAxis.title.dx = 50;

    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = 'dateStart';
    series.dataFields.dateY = 'dateEnd';
    series.dataFields.openValueY = 'leads';
    series.dataFields.valueY = 'opportunities';
    series.tooltipText =
      'Leads: {openValueY.value} Opportunities: {valueY.value} Period: {dateX} - {dateY} ';
    series.stroke = chart.colors.getIndex(6);
    series.sequencedInterpolation = true;
    series.defaultState.transitionDuration = 1000;
    series.tensionX = 0.8;
    series.fillOpacity = .8;

    var series2 = chart.series.push(new am4charts.LineSeries());

    series2.dataFields.dateX = 'dateStart';
    series2.dataFields.valueY = 'opportunities';
    series2.sequencedInterpolation = true;
    series2.defaultState.transitionDuration = 1500;
    series2.stroke = chart.colors.getIndex(5);
    series2.tensionX = 0.8;
    series2.fillOpacity = .8;
    series2.fill = am4core.color('#99d98c');
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
