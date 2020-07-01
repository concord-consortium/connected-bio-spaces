import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../../base";
import { PieChart, PieChartData } from "../../charts/pie-chart";
import { INestPair } from "../../../models/spaces/breeding/breeding";
// @ts-ignore
import * as colors from "../../../components/colors.scss";
import "./breeding-data-nest-panel.sass";

interface IState {}

interface IProps extends IBaseProps {
  nestPair: INestPair;
}

@inject("stores")
@observer
export class BreedingDataNestPanel extends BaseComponent<IProps, IState> {
  public render() {
    const { nestPair } = this.props;
    const currentBreeding = nestPair.currentBreeding;
    const hasBeenVisited = nestPair.hasBeenVisited;
    const hasBred = nestPair.numOffspring > 0;
    const leftMouseImage = hasBeenVisited ? nestPair.leftMouse.baseImage : "assets/mouse_collect.png";
    const rightMouseImage = hasBeenVisited ? nestPair.rightMouse.baseImage : "assets/mouse_collect.png";
    const nestClass = "nest-display " + (currentBreeding ? "current" : (hasBeenVisited ? "active" : ""));
    const titleClass = "title " + (currentBreeding ? "current" : (hasBeenVisited ? "active" : ""));
    const showLabel = nestPair.numOffspring > 0;
    const pieLabel = showLabel ? `${nestPair.numOffspring} offspring` : "";

    return(
      <div className="nesting-pair-data-panel">
        <div className="pair-data">
          <div className={nestClass} onClick={this.handleClickMouseButton}>
            <div className="mouse-holder">
              <img src={leftMouseImage} className={"left-mouse"}/>
              <img src={rightMouseImage} className={"right-mouse"}/>
            </div>
            <div className={titleClass}>{nestPair.label}</div>
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
    let pieData: PieChartData[] = [];
    const { breeding } = this.stores;
    const { chartType  } = breeding;
    const data = this.props.nestPair.getData(chartType);

    if (chartType === "genotype") {
      pieData = [{label: "RᴸRᴸ", value: data.CC, color: colors.colorDataMouseBrownLightRep},
                 {label: "RᴸRᴰ", value: data.CR, color: colors.colorDataMouseBrownMediumRep},
                 {label: "RᴰRᴸ", value: data.RC, color: colors.colorDataMouseBrownMediumRep},
                 {label: "RᴰRᴰ", value: data.RR, color: colors.colorDataMouseBrownDarkRep}];
    } else if (chartType === "sex") {
      pieData = [{label: "Female", value: data.female, color: colors.colorChartYellow},
                 {label: "Male", value: data.male, color: colors.colorChartRed}];
    } else {
      pieData = [{label: "Light", value: data.white, color: colors.colorDataMouseBrownLightRep},
                 {label: "Medium", value: data.tan, color: colors.colorDataMouseBrownMediumRep},
                 {label: "Dark", value: data.brown, color: colors.colorDataMouseBrownDarkRep}];
    }
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
