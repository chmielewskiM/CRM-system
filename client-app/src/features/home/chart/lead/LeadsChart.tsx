import React, { Fragment, useLayoutEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_microchart from '@amcharts/amcharts4/themes/microchart';
import { observer } from 'mobx-react-lite';
import LoaderComponent from '../../../../app/layout/LoaderComponent';
am4core.useTheme(am4themes_microchart);

interface IProps {
  data: { startDate: Date; endDate:Date; value: number }[] | { name: string; value: number }[];
  loading: boolean;
}

const LeadsChart: React.FC<IProps> = (props) => {
  useLayoutEffect(() => {
    var chart = am4core.create('leadsChart', am4charts.XYChart);
    chart.data = props.data;
    // chart.dateFormatter.dateFormat = 'yyyy/mm';
    chart.paddingBottom= 10;
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.labels.template.disabled = true;
    dateAxis.renderer.labels.template.location = 0.5;
    dateAxis.renderer.grid.template.disabled = true;
    dateAxis.renderer.ticks.template.location = 0.5;
    dateAxis.renderer.minGridDistance = 0;
    dateAxis.renderer.ticks.template.minX = 0;
    dateAxis.dateFormatter.dateFormat = 'yyyy/MMM';
    dateAxis.skipEmptyPeriods = true;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // dateAxis.title.text = 'Time';
    // dateAxis.title.align = 'center';
    // dateAxis.title.fontSize='1.6rem';
    dateAxis.title.fill = am4core.color('#fff');
    // valueAxis.title.text = 'Count';
    // valueAxis.title.align = 'center';
    // valueAxis.title.fontSize='1.6rem';
    valueAxis.title.fill = am4core.color('#fff');
    var series = chart.series.push(new am4charts.LineSeries());

    series.dataFields.dateX = 'startDate';
    series.dataFields.dateY = 'endDate';

    series.dataFields.valueY = 'value';
    series.tooltipText =
    'Leads: {valueY.value} Period: {dateX} - {dateY} ';

    series.fillOpacity = 0.7;
    series.defaultState.transitionDuration = 500;
    series.fill = am4core.color('#f3722c');
    series.tensionX = 1;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.snapToSeries = series;
    chart.cursor.xAxis = dateAxis;

    series.tooltip!.label.fontWeight = '700';
    series.tooltip!.autoTextColor = false;
    series.tooltip!.label.fill = am4core.color('#fff');

    return () => {
      chart.dispose();
    };
  }, [props.data]);

  return (
    <Fragment>
      {props.loading && <LoaderComponent content="Loading..." />}
      <div id="leadsChart" style={{ width: '100%', height: '90%' }}></div>
    </Fragment>
  );
};

export default observer(LeadsChart);
