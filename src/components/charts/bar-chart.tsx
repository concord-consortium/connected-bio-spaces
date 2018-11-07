import * as React from "react";
import { observer } from "mobx-react";
import { HorizontalBar, Bar } from "react-chartjs-2";

interface BarProps {
}

interface BarState { }

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

@observer
export class HorizontalBarChart extends React.Component<BarProps, BarState> {

  public render() {
    const options = kDefaultOptions;
    const data = kSampleData;
    return (
        <HorizontalBar
          data={data}
          options={options}
          height={400}
        />
    );
  }
}
@observer
export class BarChart extends React.Component<BarProps, BarState> {

  public render() {
    const options = kDefaultOptions;
    const data = kSampleData;
    return (
        <Bar
          data={data}
          options={options}
          height={400}
        />
    );
  }
}

export default BarChart;
