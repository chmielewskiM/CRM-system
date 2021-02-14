import React, { PureComponent, Fragment, useLayoutEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { observer } from 'mobx-react-lite';
am4core.useTheme(am4themes_animated);
interface IProps {
  data: { name: string; value: number }[];
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
    return () => {
      pipeline.dispose();
    };
  }, [props.data]);

  return (
    <Fragment>
      <div id="pipeline" style={{ width: '80%', height: '80%' }}></div>
    </Fragment>
  );
};

export default observer(Pipeline);
