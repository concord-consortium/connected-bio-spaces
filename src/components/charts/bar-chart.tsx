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
    text: "Sample Dataset",
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
  backgroundColor: "rgba(75,192,192,0.4)",
  pointBorderColor: "rgba(75,192,192,1)",
  pointBackgroundColor: "#fff",
  pointBorderWidth: 1,
  pointHoverRadius: 5,
  pointHoverBackgroundColor: "rgba(75,192,192,1)",
  pointHoverBorderColor: "rgba(220,220,220,1)",
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
