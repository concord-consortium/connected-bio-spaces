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
    display: true,
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
  pointBackgroundColor: "#fff",
  pointBorderWidth: 1,
  pointHoverRadius: 5,
  pointHoverBorderWidth: 2,
  pointRadius: 1,
  pointHitRadius: 10,
  data: [0],
  backgroundColor: ChartColors.map(c => hexToRGBValue(c.hex, 0.4)),
  borderColor: ChartColors.map(c => hexToRGBValue(c.hex, 1.0))
};

const barData = (chartData: ChartDataModelType) => {
  const barDatasets = [];
  for (const d of chartData.dataSets) {
    const dset = Object.assign({}, barDatasetDefaults, {
      label: d.name,
      data: d.dataA1
    });
    barDatasets.push(dset);
  }

  const barChartData = {
    labels: chartData.dataLabels,
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
          redraw={true}
        />
      );
    } else {
      return (
        <HorizontalBar
          data={chartDisplay}
          options={options}
          height={h}
          width={w}
          redraw={true}
        />
      );
    }

  }
}

export default BarChart;
