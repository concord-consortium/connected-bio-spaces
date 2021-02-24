import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../../base";
import { BreedingDataNestPanel } from "./breeding-data-nest-panel";
// @ts-ignore
import * as colors from "../../../components/colors.scss";
import "./breeding-data.sass";
import { speciesDef } from "../../../models/units";

interface IProps extends IBaseProps {}
interface IState {}

export interface LegendItem {
  label: string;
  color: string;
}

@inject("stores")
@observer
export class BreedingData extends BaseComponent<IProps, IState> {

  public render() {
    const { breeding } = this.stores;
    const { chartType, nestPairs } = breeding;
    const species = speciesDef(nestPairs[0].leftMouse.species);
    const chartInfo = species.chartTypes[chartType];
    return(
      <div className="breeding-data">
        <div className="data-title">{chartInfo.title}</div>
        <div className="nest-pair-container">
          {
            nestPairs.map((pair, i) =>
              <BreedingDataNestPanel
                nestPair={pair}
                key={i}
              />
            )
          }
        </div>
        <div className="data-legend">{this.renderLegend(chartInfo.legend)}</div>
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
