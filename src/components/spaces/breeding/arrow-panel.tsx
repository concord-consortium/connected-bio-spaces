import * as React from "react";
import { BaseComponent, IBaseProps } from "../../base";
// @ts-ignore
import * as colors from "../../../components/colors.scss";
import "./arrow-panel.sass";

export interface ArrowInfo {
  startX: number;
  endX: number;
  startY: number;
  endY: number;
  headRotation: number;
  visible: boolean;
}

interface IProps extends IBaseProps {
  arrows: ArrowInfo[];
}
interface IState {}

export class ArrowPanel extends BaseComponent<IProps, IState> {

  public render() {

    return(
      <div className="arrow-panel">
        <svg height={130} width={300}>
          {this.renderArrowCurves()}
          {this.renderArrowHeads()}
        </svg>
      </div>
    );
  }

  private renderArrowCurves = () => {
    return(
      this.props.arrows.map((arrow, i) => {
        const { startX, startY, endX, endY } = arrow;
        const controlPt1X = startX + (Math.abs(endX - startX)) * .2 * (endX > startX ? 1 : -1);
        const controlPt2X = endX - (Math.abs(endX - startX)) * .2 * (endX > startX ? 1 : -1);
        const path = `M${startX},${startY} C${controlPt1X},${endY / 2} ${controlPt2X},${endY / 2} ${endX},${endY}`;
        return (
          <path
            d={path}
            fill="none"
            stroke={colors.gameteArrowColor}
            strokeWidth={5}
            strokeDasharray={5}
            className={`arrow ${arrow.visible ? "" : "hide"}`}
            key={"path" + i}
          />
        );
      })
    );
  }

  private renderArrowHeads = () => {
    return(
      this.props.arrows.map((arrow, i) => {
        const { endX, endY } = arrow;
        const points = `${endX - 5},${endY} ${endX},${endY + 10} ${endX + 5},${endY}`;
        return (
          <polygon
            points={points}
            fill={colors.gameteArrowColor}
            stroke={colors.gameteArrowColor}
            strokeWidth={1}
            className={`arrow ${arrow.visible ? "" : "hide"}`}
            key={"polygon" + i}
            transform={`rotate(${arrow.headRotation} ${endX} ${endY + 5})`}
          />
        );
      })
    );
  }
}
