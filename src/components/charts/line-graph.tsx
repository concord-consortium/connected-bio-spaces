import * as React from "react";
import { Scatter } from "react-chartjs-2";
import { observer } from "mobx-react";

interface LineProps {
}

interface LineState {
}

const MAX_STORED_STATES = 100;

const sampleData = {
  labels: ["Scatter"],
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
      data: [
        { x: 65, y: 75 },
        { x: 59, y: 49 },
        { x: 80, y: 90 },
        { x: 81, y: 29 },
        { x: 56, y: 36 },
        { x: 55, y: 25 },
        { x: 40, y: 18 },
      ]
    }
  ]
};

@observer
export class LineGraph extends React.Component<LineProps, LineState> {
  constructor(props: any) {
    super(props);
  }

  public createLine() {
    const color =  "#00aae2"; // $color7
    return {
      borderWidth: 3,
      backgroundColor: color,
      borderColor: color,
      fill: false,
      tension: 0
    };
  }

  public render() {
    console.log("render line");
    const graphs: JSX.Element[] = [];

    const chartTitle = {
      display: true,
      text: "Something Over Time",
      fontSize: 22
    };

    const chartLegend = {
      display: true,
      position: "bottom",
    };

    const defaultOptions: any = {
      title: chartTitle,
      legend: chartLegend,
      scales: {
        display: false,
        yAxes: [{
          ticks: {
            min: 0,
            max: 100
          }
        }],
        xAxes: [{
          display: false,
          ticks: {
            min: 0,
            max: MAX_STORED_STATES
          }
        }]
      },
      elements: { point: { radius: 0 } },
      showLines: true
    };

    const options: any = Object.assign({}, defaultOptions, {
      scales: {
        display: false,
        yAxes: [{
          ticks: {
            min: 0,
            max: 100
          },
          scaleLabel: {
            display: true,
            fontSize: 12
          }
        }],
        xAxes: [{
          display: false,
          ticks: {
            min: 0,
            max: MAX_STORED_STATES
          }
        }]
      }
    });

    graphs.push(
      <Scatter
        key={3}
        data={sampleData}
        options={options}
        height={400}
        width={400}
      />
    );

    return (
      <div>
        {graphs}
      </div>
    );
  }
}

export default LineGraph;
