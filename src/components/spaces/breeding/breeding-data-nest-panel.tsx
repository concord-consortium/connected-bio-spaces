import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../../base";
import { PieChart, PieChartData } from "./pie-chart";
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
    const activeBreeding = nestPair.activeBreeding;
    const currentBreeding = nestPair.currentBreeding;
    const leftMouseImage = activeBreeding ? nestPair.leftMouse.baseImage : "assets/mouse_collect.png";
    const rightMouseImage = activeBreeding ? nestPair.rightMouse.baseImage : "assets/mouse_collect.png";
    const nestClass = "nest-display " + (currentBreeding ? "current" : (activeBreeding ? "active" : ""));
    const titleClass = "title " + (currentBreeding ? "current" : (activeBreeding ? "active" : ""));
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
          { activeBreeding
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
    const { chartType } = breeding;
    // TODO this is fake data that needs to be replaced
    if (chartType === "genotype") {
      pieData = [{label: "RLRL", value: 10, color: colors.colorDataMouseBrownLightRep},
                 {label: "RLRD", value: 15, color: colors.colorDataMouseBrownMediumRep},
                 {label: "RDRL", value: 20, color: colors.colorDataMouseBrownMediumRep},
                 {label: "RDRD", value: 13, color: colors.colorDataMouseBrownDarkRep}];
    } else if (chartType === "sex") {
      pieData = [{label: "Female", value: 20, color: colors.colorChartYellow},
                 {label: "Male", value: 20, color: colors.colorChartRed}];
    } else {
      pieData = [{label: "Light", value: 20, color: colors.colorDataMouseBrownLightRep},
                 {label: "Medium", value: 20, color: colors.colorDataMouseBrownMediumRep},
                 {label: "Dark", value: 10, color: colors.colorDataMouseBrownDarkRep}];
    }
    return (
      <PieChart data={pieData}/>
    );
  }

  private handleClickMouseButton = () => {
    const { nestPair } = this.props;
    const activeBreeding = nestPair.activeBreeding;
    if (activeBreeding) {
      const currentBreeding = nestPair.currentBreeding;
      !currentBreeding && this.stores.breeding.setNestPairCurrentBreeding(nestPair.id, true);
    }
  }

}
