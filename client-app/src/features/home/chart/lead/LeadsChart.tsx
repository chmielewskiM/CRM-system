import React, { Fragment, useLayoutEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_microchart from '@amcharts/amcharts4/themes/microchart';
import { observer } from 'mobx-react-lite';
am4core.useTheme(am4themes_microchart);

interface IProps {
  data: { name: Date; value: number }[] | { name: string; value: number }[];
}

const LeadsChart: React.FC<IProps> = (props) => {
  useLayoutEffect(() => {
    var chart = am4core.create('leadsChart', am4charts.XYChart);
    chart.data = props.data;
    chart.dateFormatter.dateFormat = "{dateX.formatDate('yyyy-mm')}";

    // let data: { name: Date; value: number }[] = [];
    // props.data.forEach((x: any) => data.push(x));

    // var dates: { date: Date }[] = [];
    // data.forEach((x) => {
    //   let obj: { date: Date } = { date: x.name };
    //   dates.push(obj);
    // });

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.labels.template.disabled = true;
    dateAxis.renderer.labels.template.location = 0.5;
    dateAxis.renderer.grid.template.disabled = true;
    dateAxis.renderer.ticks.template.location = 0.5;
    dateAxis.renderer.minGridDistance = 0;
    dateAxis.renderer.ticks.template.minX = 0;
    dateAxis.dateFormatter.dateFormat = "{dateX.formatDate('yyyy-mm')}";
    dateAxis.skipEmptyPeriods = true;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // valueAxis.tooltip!.disabled = true;

    var series = chart.series.push(new am4charts.LineSeries());

    series.dataFields.dateX = 'name';

    series.dataFields.valueY = 'value';
    series.tooltipText = "{dateX.formatDate('yyyy-MM-dd')}: {valueY.formatNumber('# leads')}";

    series.fillOpacity = 0.4;
    series.defaultState.transitionDuration = 500;
    series.tensionX = 1;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.snapToSeries = series;
    chart.cursor.xAxis = dateAxis;
    return () => {
      chart.dispose();
    };
  }, [props.data]);

  return (
    <Fragment>
      <div id="leadsChart" style={{ width: '100%', height: '80%' }}></div>
    </Fragment>
  );
};

export default observer(LeadsChart);
