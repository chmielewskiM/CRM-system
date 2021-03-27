import React, { Fragment, useLayoutEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_microchart from '@amcharts/amcharts4/themes/microchart';
import { observer } from 'mobx-react-lite';
import LoaderComponent from '../../../../app/layout/LoaderComponent';
am4core.useTheme(am4themes_microchart);

interface IProps {
  data:
    | { name: string; leads: number; opportunities: number }[]
    | { name: Date; leads: number; opportunities: number }[];
  loading: boolean;
}

const OpportunityByEmployeeChart: React.FC<IProps> = (props) => {
  
  useLayoutEffect(() => {
    
    var chart = am4core.create(
      'opportunitiesByEmployeeChart',
      am4charts.XYChart
    );
    chart.data = props.data;

    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'name';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = 'Count';

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'leads';
    series.dataFields.categoryX = 'name';
    series.name = 'Leads';
    series.tooltipText = '{name} leads: [bold]{valueY}[/]';
    series.stacked = true;

    var series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.dataFields.valueY = 'opportunities';
    series2.dataFields.categoryX = 'name';
    series2.name = 'Opportunities';
    series2.tooltipText = '{name} opportunities: [bold]{valueY}[/]';
    series2.stacked = true;

    // Add cursor
    chart.cursor = new am4charts.XYCursor();

    series.tooltip!.label.fontWeight = '700';
    series2.tooltip!.label.fontWeight = '700';
    series.tooltip!.autoTextColor = false;
    series2.tooltip!.autoTextColor = false;
    series.tooltip!.label.fill = am4core.color('#ffd60a');
    series2.tooltip!.label.fill = am4core.color('#99d98c');

    return () => {
      chart.dispose();
    };
  }, [props.data]);

  return (
    <Fragment>
      {props.loading && <LoaderComponent content="Loading..." />}
      <div
        id="opportunitiesByEmployeeChart"
        style={{ width: '100%', height: '100%' }}
      ></div>
    </Fragment>
  );
};

export default OpportunityByEmployeeChart;
