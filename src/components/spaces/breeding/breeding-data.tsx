import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../../base";
import { BreedingDataNestPanel } from "./breeding-data-nest-panel";
// @ts-ignore
import * as colors from "../../../components/colors.scss";
import "./breeding-data.sass";

interface IProps extends IBaseProps {}
interface IState {}

interface LegendItem {
  label: string;
  color: string;
}
const sexLegend: LegendItem[] = [
  {label: "Female", color: colors.colorChartYellow},
  {label: "Male", color: colors.colorChartRed}
];
const colorLegend: LegendItem[] = [
  {label: "Light Brown", color: colors.colorDataMouseBrownLightRep},
  {label: "Medium Brown", color: colors.colorDataMouseBrownMediumRep},
  {label: "Dark Brown", color: colors.colorDataMouseBrownDarkRep}
];
const genotypeLegend: LegendItem[] = [
  {label: "R<sup>L</sup>R<sup>L</sup> Mice", color: colors.colorDataMouseBrownLightRep},
  {label: "R<sup>L</sup>R<sup>D</sup> Mice", color: colors.colorDataMouseBrownMediumRep},
  {label: "R<sup>D</sup>R<sup>L</sup> Mice", color: colors.colorDataMouseBrownMediumRep},
  {label: "R<sup>D</sup>R<sup>D</sup> Mice", color: colors.colorDataMouseBrownDarkRep}
];
const chartInfo = {
  color: {legend: colorLegend, title: "Fur Colors" },
  genotype: {legend: genotypeLegend, title: "Genotypes" },
  sex: {legend: sexLegend, title: "Sex" }
};

@inject("stores")
@observer
export class BreedingData extends BaseComponent<IProps, IState> {

  public render() {
    const { breeding } = this.stores;
    const { chartType } = breeding;
    return(
      <div className="breeding-data">
        <div className="data-title">{chartInfo[chartType].title}</div>
        <div className="nest-pair-container">
          {
            breeding.nestPairs.map((pair, i) =>
              <BreedingDataNestPanel
                nestPair={pair}
                key={i}
              />
            )
          }
        </div>
        <div className="data-legend">{this.renderLegend(chartInfo[chartType].legend)}</div>
      </div>
    );
  }

  public renderLegend(legend: LegendItem[]) {
    return(
      legend.map((item, i) => {
        return(
          <div className="legend-item" key={i}>
            <div className="square" style={{backgroundColor: item.color}}/>
            <div className="label" dangerouslySetInnerHTML={{
                __html: item.label
            }} />
          </div>
        );
      })
    );
  }

}
