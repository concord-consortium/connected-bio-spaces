import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../../base";
import { PieChart, PieChartData } from "../../charts/pie-chart";
import { INestPair } from "../../../models/spaces/breeding/breeding";
import { speciesDef, units } from "../../../models/units";
// @ts-ignore
import * as colors from "../../../components/colors.scss";
import "./breeding-data-nest-panel.sass";
import "./breeding-data-nest-panel.pea.sass";

interface IState {}

interface IProps extends IBaseProps {
  nestPair: INestPair;
}

@inject("stores")
@observer
export class BreedingDataNestPanel extends BaseComponent<IProps, IState> {
  public render() {
    const { unit, breeding } = this.stores;
    const { nestPair } = this.props;
    const {breeding: breedingUnit, species} = units[unit];
    const currentBreeding = nestPair.currentBreeding;
    const hasBeenVisited = nestPair.hasBeenVisited;
    const hasBred = nestPair.numOffspring > 0;
    const leftMouseImage = hasBeenVisited ? nestPair.leftMouse.chartImage : nestPair.leftMouse.chartEmptyImage;
    const rightMouseImage = hasBeenVisited ? nestPair.rightMouse.chartImage : nestPair.rightMouse.chartEmptyImage;
    const leftMouseSecondaryImage = hasBeenVisited ? nestPair.leftMouse.secondaryChartImage : null;
    const rightMouseSecondaryImage = hasBeenVisited ? nestPair.rightMouse.secondaryChartImage : null;
    const nestClass = "nest-display " + (currentBreeding ? "current" : (hasBeenVisited ? "active" : ""));
    const titleClass = "title " + (currentBreeding ? "current" : (hasBeenVisited ? "active" : ""));
    const showLabel = nestPair.numOffspring > 0;
    const pieLabel = showLabel ? `${nestPair.numOffspring} offspring` : "";
    const showGenotype = hasBeenVisited && breedingUnit.showGenotypeUnderChartImage && breeding.showParentGenotype;

    return(
      <div className={`nesting-pair-data-panel ${unit}`}>
        <div className="pair-data">
          <div className={nestClass} onClick={this.handleClickMouseButton}>
            <div className="mouse-holder">
              <img src={leftMouseImage} className={"left-mouse"}/>
              <img src={rightMouseImage} className={"right-mouse"}/>
            </div>
            <div className={titleClass}>{nestPair.chartLabel}</div>
          </div>
          <div className={
            `label-footer ${leftMouseSecondaryImage ? "with-images" : ""} ${showGenotype ? "with-genotype" : ""}`
          }>
            { (leftMouseSecondaryImage && rightMouseSecondaryImage) &&
              <div className="secondary-images">
                <img src={leftMouseSecondaryImage} className="left-mouse"/>
                <img src={rightMouseSecondaryImage} className="right-mouse"/>
              </div>
            }
            { showGenotype &&
              <div className="parent-genotypes">
                <span className="left-mouse">
                  {species.getGenotypeHTMLLabel(nestPair.leftMouse.genotype)}
                </span>
                <span className="right-mouse">
                  {species.getGenotypeHTMLLabel(nestPair.rightMouse.genotype)}
                </span>
              </div>
            }
          </div>
          { hasBred
            ? this.renderPieChart()
            : <div className="empty-pie"/>
          }
        </div>
        <div className="pie-label">{pieLabel}</div>
      </div>
    );
  }

  private renderPieChart() {
    const { breeding } = this.stores;
    const { chartType  } = breeding;
    const data = this.props.nestPair.getData(chartType);
    const species = speciesDef(this.props.nestPair.leftMouse.species);

    let pieData: PieChartData[] = species.getChartData(chartType, data);

    // remove missing values
    pieData = pieData.filter(datum => datum.value);

    return (
      <PieChart data={pieData}/>
    );
  }

  private handleClickMouseButton = () => {
    const { nestPair } = this.props;
    if (nestPair.hasBeenVisited) {
      const currentBreeding = nestPair.currentBreeding;
      !currentBreeding && this.stores.breeding.setNestPairCurrentBreeding(nestPair.id);
    }
  }

}
