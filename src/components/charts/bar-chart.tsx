import * as React from "react";
import { observer } from "mobx-react";
import { HorizontalBar, Bar } from "react-chartjs-2";
import { ChartDataModelType } from "../../models/spaces/charts/chart-data";

interface BarProps {
  chartData: ChartDataModelType;
}

interface BarState {
  chartDisplay: any;
}

const kSampleData = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "My First dataset",
      backgroundColor: "rgba(255,99,132,0.2)",
      borderColor: "rgba(255,99,132,1)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(255,99,132,0.4)",
      hoverBorderColor: "rgba(255,99,132,1)",
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ]
};

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

const barData = (chartData: ChartDataModelType) => {
  const kChartData = {
    labels: chartData.dataLabels,
    datasets: [
      {
        label: "My First dataset",
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
        data: chartData.dataA1
      }
    ]
  };
  return kChartData;
};

@observer
export class BarChart extends React.Component<BarProps, BarState> {
  constructor(props: BarProps) {
    super(props);
    const chartDisplay = barData(props.chartData);
    this.state = {
      chartDisplay
    };
  }
  public render() {
    const { chartData } = this.props;
    const { chartDisplay } = this.state;

    const options: any = Object.assign({}, kDefaultOptions, {
      scales: {
        xAxes: [{
          ticks: {
            min: 0,
            max: chartData.maxA1
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
export class HorizontalBarChart extends React.Component<BarProps, BarState> {
  constructor(props: BarProps) {
    super(props);
    const chartDisplay = barData(props.chartData);
    this.state = {
      chartDisplay
    };
  }
  public render() {
    const { chartData } = this.props;
    const { chartDisplay } = this.state;

    const options: any = Object.assign({}, kDefaultOptions, {
      scales: {
        xAxes: [{
          ticks: {
            min: 0,
            max: chartData.maxA1
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
