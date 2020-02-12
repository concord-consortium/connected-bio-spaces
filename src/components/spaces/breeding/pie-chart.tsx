import * as React from "react";
import { BaseComponent, IBaseProps } from "../../base";
import { Pie } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import * as ChartDataLabels from "chartjs-plugin-datalabels";

const CHART_HEIGHT = 90;
const CHART_WIDTH = 90;

export interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface IProps extends IBaseProps {
  data: PieChartData[];
}
interface IState {}

export class PieChart extends BaseComponent<IProps, IState> {

  public render() {
    const dataLabels = this.props.data.map(pieChartData => pieChartData.label);
    const dataPoints = this.props.data.map(pieChartData => pieChartData.value);
    const dataColors = this.props.data.map(pieChartData => pieChartData.color);
    const pieData = {
      labels: dataLabels,
      datasets: [{
        backgroundColor: dataColors,
        data: dataPoints
      }]
    };

    const defaultOptions: ChartOptions = {
      tooltips: {
        enabled: true,
        callbacks: {
          label: function(tooltipItems: any, data: any) {
            return (data.labels && tooltipItems ? data.labels[tooltipItems.index] : "");
          }
        }
      },
      plugins: {
        datalabels: {
          formatter(value: any, ctx: any) {
            let sum = 0;
            const dataArr = ctx.chart.data.datasets[0].data;
            dataArr.map((data: any) => {
              sum += data;
            });
            const percentage = (value * 100 / sum).toFixed(0) + "%";
            return percentage;
          },
          color(ctx: any) {
            let labelColor = "";
            switch (ctx.dataset.backgroundColor[ctx.dataIndex]) {
              case "#bf8f53":
              case "#dfc39d":
              case "#FEFF59":
                labelColor = "#000000";
                break;
              default:
                labelColor = "#ffffff";
            }
            return labelColor;
          },
          font: {
            size: 12
          }
        }
      },
      animation: {
        duration: 0
      },
      title: {
        display: false,
      },
      legend: {
        display: false,
      },
      maintainAspectRatio: false,
    };

    return(
      <div className="pie-chart">
        <Pie
          data={pieData}
          options={defaultOptions}
          height={CHART_HEIGHT}
          width={CHART_WIDTH}
          redraw={false}
          plugins={[ChartDataLabels]}
          data-test="pie"
        />
      </div>
    );
  }
}
