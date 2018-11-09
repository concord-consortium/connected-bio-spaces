import * as React from "react";
import { Scatter, ChartData } from "react-chartjs-2";
import { observer } from "mobx-react";
import { ChartDataModelType } from "../../models/spaces/charts/chart-data";

interface ILineProps {
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
  },
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

const lineDatasetDefaults: ChartData<any> = {
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

const lineData = (chartData: ChartDataModelType) => {
  const lineDatasets = [];
  for (const d of chartData.data) {
    const dset = Object.assign({}, lineDatasetDefaults, {
      label: d.name,
      data: d.dataAsXY
    });
    lineDatasets.push(dset);
  }

  const linePlotData = {
    labels: chartData.dataLabels,
    datasets: lineDatasets
  };

  return linePlotData;
};

const kEdgePadding = 0.1;
@observer
export class LineGraph extends React.Component<ILineProps> {
  constructor(props: ILineProps) {
    super(props);
  }

  public render() {
    const { chartData } = this.props;
    const chartDisplay = lineData(chartData);
    const graphs: JSX.Element[] = [];
    const minMaxValues = chartData.minMaxAll;
    const options: any = Object.assign({}, kDefaultOptions, {
      title: {
        text: chartData.name
      },
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
}

export default LineGraph;
