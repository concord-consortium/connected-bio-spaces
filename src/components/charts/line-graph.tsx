import * as React from "react";
import { Scatter } from "react-chartjs-2";
import { observer } from "mobx-react";
import { ChartDataModelType } from "../../models/spaces/charts/chart-data";

interface LineProps {
  chartData: ChartDataModelType;
}

interface LineState {
  chartDisplay: any;
}

const chartTitle = {
  display: true,
  text: "Sample Line Chart",
  fontSize: 22
};

const chartLegend = {
  display: true,
  position: "bottom",
};

const kDefaultOptions: any = {
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
        max: 100
      }
    }]
  },
  elements: { point: { radius: 0 } },
  showLines: true
};

const kEdgePadding = 0.1;
@observer
export class LineGraph extends React.Component<LineProps, LineState> {
  constructor(props: LineProps) {
    super(props);
    const chartDisplay = this.lineData(props.chartData);
    this.state = {
      chartDisplay
    };
  }

  public render() {
    const { chartData } = this.props;
    const { chartDisplay } = this.state;
    const graphs: JSX.Element[] = [];
    const minMaxValues = {
      minA1: chartData.minA1 || 0,
      minA2: chartData.minA2 || 0,
      maxA1: chartData.maxA1 || 100,
      maxA2: chartData.maxA2 || 100
    };
    const options: any = Object.assign({}, kDefaultOptions, {
      scales: {
        display: false,
        yAxes: [{
          ticks: {
            min: minMaxValues.minA2 - (minMaxValues.minA2 * kEdgePadding),
            max: minMaxValues.maxA2 + (minMaxValues.maxA2 * kEdgePadding)
          },
          scaleLabel: {
            display: true,
            fontSize: 12
          }
        }],
        xAxes: [{
          display: false,
          ticks: {
            min: minMaxValues.minA1 - (minMaxValues.minA1 * kEdgePadding),
            max: minMaxValues.maxA1 + (minMaxValues.maxA1 * kEdgePadding)
          }
        }]
      }
    });

    graphs.push(
      <Scatter
        key={3}
        data={chartDisplay}
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

  private lineData = (chartData: ChartDataModelType) => {
    const kChartData = {
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
          data: chartData.dataAsXY
        }
      ]
    };
    return kChartData;
  }
}

export default LineGraph;
