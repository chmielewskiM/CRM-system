import React, { Fragment, useLayoutEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_microchart from '@amcharts/amcharts4/themes/microchart';
import { observer } from 'mobx-react-lite';
import LoaderComponent from '../../../../app/layout/LoaderComponent';
am4core.useTheme(am4themes_animated);

interface IProps {
  data: { name: string; value: number }[] | { startDate: Date; endDate:Date; value: number }[];
  loading: boolean;
}

const LeadsBySourceChart: React.FC<IProps> = (props) => {
  useLayoutEffect(() => {
    // Create chart instance
    var chart = am4core.create('leadsBySourceChart', am4charts.PieChart3D);

    // Let's cut a hole in our Pie chart the size of 40% the radius
    chart.innerRadius = am4core.percent(40);

    let data: { name: string; value: number }[] = [];
    props.data.forEach((x: any) => data.push(x));
    // Add data
    chart.data = props.data;
    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries3D());
    pieSeries.dataFields.value = 'value';
    pieSeries.dataFields.category = 'name';
    pieSeries.slices.template.stroke = am4core.color('#fff');
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;

    // Disabling labels and ticks on inner circle
    pieSeries.labels.template.disabled = true;
    pieSeries.ticks.template.disabled = true;

    // Disable sliding out of slices
    pieSeries.slices.template.states.getKey(
      'hover'
    )!.properties.shiftRadius = 0;
    pieSeries.slices.template.states.getKey('hover')!.properties.scale = 1.1;

    pieSeries.colors.list = [
      am4core.color('#083d77'),
      am4core.color('#da4167'),
      am4core.color('#fdc500'),
      am4core.color('#06d6a0'),
      am4core.color('#001427'),

    ];
    
    pieSeries.tooltip!.label.fontWeight = '700';

    return () => {
      chart.dispose();
    };
  }, [props.data]);

  return (
    <Fragment>
      {props.loading && <LoaderComponent content="Loading..." />}
      <div
        id="leadsBySourceChart"
        style={{ width: '100%', height: '100%' }}
      ></div>
    </Fragment>
  );
};

export default observer(LeadsBySourceChart);
