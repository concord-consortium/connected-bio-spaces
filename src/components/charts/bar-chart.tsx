import * as React from "react";
import { observer } from "mobx-react";
import { HorizontalBar, Bar, ChartData } from "react-chartjs-2";
import { ChartDataModelType } from "../../models/spaces/charts/chart-data";

interface IBarProps {
  chartData: ChartDataModelType;
}

const kDefaultOptions: any = {
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
  scales: {
    xAxes: [{
      ticks: {
        min: 0,
        max: 100
      },
      stacked: true
    }],
    yAxes: [{
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
  data: [0]
};

const barData = (chartData: ChartDataModelType) => {
  const barDatasets = [];
  for (const d of chartData.data) {
    const dset = Object.assign({}, barDatasetDefaults, {
      label: d.name,
      data: d.dataA1,
      backgroundColor: "rgba(" + d.colorRGB + ",0.4)",
      pointBorderColor: "rgba(" + d.colorRGB + ",1)",
      pointHoverBackgroundColor: "rgba(" + d.colorRGB + ",1)"
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
    const { chartData } = this.props;
    const chartDisplay = barData(chartData);
    const options: any = Object.assign({}, kDefaultOptions, {
      scales: {
        xAxes: [{
          ticks: {
            min: 0,
            max: chartData.minMaxAll.maxA1
          },
          stacked: true
        }]
      }
    });
    return (
        <Bar
          data={chartDisplay}
          options={options}
          height={400}
        />
    );
  }
}

@observer
export class HorizontalBarChart extends React.Component<IBarProps> {
  constructor(props: IBarProps) {
    super(props);
  }
  public render() {
    const { chartData } = this.props;
    const chartDisplay = barData(chartData);
    const options: any = Object.assign({}, kDefaultOptions, {
      scales: {
        xAxes: [{
          ticks: {
            min: 0,
            max: chartData.minMaxAll.maxA1
          },
          stacked: true
        }]
      }
    });
    return (
        <HorizontalBar
          data={chartDisplay}
          options={options}
          height={400}
        />
    );
  }
}

export default BarChart;
