import * as React from "react";
import { observer } from "mobx-react";
import { HorizontalBar, Bar, ChartData } from "react-chartjs-2";
import { ChartDataModelType } from "../../models/spaces/charts/chart-data";
import { ChartOptions, ChartType } from "chart.js";
import { ChartColors } from "../../models/spaces/charts/chart-data-set";
import { hexToRGBValue } from "../../utilities/color-utils";

interface IBarProps {
  chartData: ChartDataModelType;
  width?: number;
  height?: number;
  barChartType: ChartType;
}

const defaultOptions: ChartOptions = {
  title: {
    display: false,
    text: "",
    fontSize: 22
  },
  legend: {
    display: true,
    position: "bottom",
    labels: {
      filter: (legendItem: any, chartData: any) => {
        // Hidden labels, like for "extra" bars, are marked with a "#"
        return legendItem.text.indexOf("#") === -1;
      },
      boxWidth: 50
    }
  },
  maintainAspectRatio: false,
  scales: {
    xAxes: [{
      ticks: {
        min: 0,
        max: 100
      },
      stacked: true
    }],
    yAxes: [{
      ticks: {
        min: 0,
        max: 100
      },
      stacked: true
    }]
  },
  tooltips: {
    enabled: false
  }
};

const barDatasetDefaults: ChartData<any> = {
  label: "",
  fill: false,
  data: [0],
  borderWidth: 2
};

const barData = (chartData: ChartDataModelType) => {
  const barDatasets = [];
  for (const d of chartData.dataSets) {
    const dset = Object.assign({}, barDatasetDefaults, {
      label: d.name,
      data: d.dataA1,
    });
    const seriesOpacity = d.backgroundOpacity ? d.backgroundOpacity : 0.4;
    if (d.color) {
      // One color for all bars
      dset.backgroundColor = hexToRGBValue(d.color, seriesOpacity);
      dset.borderColor = hexToRGBValue(d.color, 1.0);
    } else if (d.pointColors) {
      // If we have specified point colors, use those first to color each bar,
      // then if we run out of defined colors we fall back to the defaults
      const colors = d.pointColors.concat(ChartColors.map(c => c.hex));
      dset.backgroundColor = colors.map(c => hexToRGBValue(c, seriesOpacity));
      dset.borderColor = colors.map(c => hexToRGBValue(c, 1.0));
    } else {
      // Default to predefined colors
      dset.backgroundColor = ChartColors.map(c => hexToRGBValue(c.hex, seriesOpacity));
      dset.borderColor = ChartColors.map(c => hexToRGBValue(c.hex, 1.0));
    }
    dset.stack = d.stack;
    barDatasets.push(dset);
  }

  const barChartData = {
    labels: chartData.chartLabels,
    datasets: barDatasets
  };

  return barChartData;
};

@observer
export class BarChart extends React.Component<IBarProps> {
  constructor(props: IBarProps) {
    super(props);
  }

  public render() {
    const { chartData, width, height, barChartType } = this.props;
    const chartDisplay = barData(chartData);
    const options: ChartOptions = Object.assign({}, defaultOptions, {
      scales: {
        xAxes: [{
          ticks: {
            min: 0,
            max: chartData.minMaxAll.maxA1
          },
          stacked: true
        }],
        yAxes: [{
          ticks: {
            min: 0,
            max: chartData.minMaxAll.maxA1
          },
          stacked: true
        }]
      }
    });
    const w = width ? width : 400;
    const h = height ? height : 400;
    if (barChartType === "bar") {
      return (
        <Bar
          data={chartDisplay}
          options={options}
          height={h}
          width={w}
          redraw={false}
          data-test="bar"
        />
      );
    } else {
      return (
        <HorizontalBar
          data={chartDisplay}
          options={options}
          height={h}
          width={w}
          redraw={false}
          data-test="horizontal-bar"
        />
      );
    }

  }
}

export default BarChart;
