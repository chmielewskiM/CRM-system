import React, { PureComponent, Fragment, useLayoutEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { observer } from 'mobx-react-lite';
import LoaderComponent from '../../../app/layout/LoaderComponent';
am4core.useTheme(am4themes_animated);
interface IProps {
  data: { name: string; value: number; percentage: string }[];
  loading: boolean;
}

const Pipeline: React.FC<IProps> = (props) => {
  useLayoutEffect(() => {
    am4core.useTheme(am4themes_animated);

    let pipeline = am4core.create('pipeline', am4charts.SlicedChart);
    pipeline.data = props.data;

    let series = pipeline.series.push(new am4charts.FunnelSeries());
    series.dataFields.value = 'value';
    series.dataFields.category = 'name';
    series.bottomRatio = 1;

    let fillModifier = new am4core.LinearGradientModifier();
    fillModifier.brightnesses = [0.3, -0.2, 0.3];
    fillModifier.offsets = [0, 0.5, 1];
    series.slices.template.fillModifier = fillModifier;

    series.colors.list = [
      am4core.color('#07BEB8'),
      am4core.color('#99d98c'),
      am4core.color('#ffd60a'),
      am4core.color('#f3722c'),
      am4core.color('#e5383b'),
    ];

    series.labels.template.disabled = true;

    series.tooltip!.autoTextColor = false;
    series.tooltip!.label.fontWeight = '700';

    series.slices.template.tooltipText =
      '{category}: {value.value} ({percentage})';

    return () => {
      pipeline.dispose();
    };
  }, [props.data]);

  return (
    <Fragment>
      {props.loading && <LoaderComponent content="Loading..." />}
      <div id="pipeline" ></div>
    </Fragment>
  );
};
// style={{ width: '90%', height: '90%' }}
export default observer(Pipeline);
