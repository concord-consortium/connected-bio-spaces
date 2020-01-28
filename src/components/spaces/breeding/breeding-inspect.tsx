import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../../base";
import { INestPair } from "../../../models/spaces/breeding/breeding";
import { BackpackMouseType } from "../../../models/backpack-mouse";
import { StackedOrganism } from "../../stacked-organism";
import "./breeding-inspect.sass";

interface IProps extends IBaseProps {
  mouse1?: BackpackMouseType;
  mouse2?: BackpackMouseType;
  pairLabel: string;
}
interface IState {}

export class BreedingInspect extends BaseComponent<IProps, IState> {

  public render() {
    const { mouse1, mouse2, pairLabel } = this.props;
    return(
      <div className="breeding-inspect">
        {(mouse1 && mouse2) && this.renderInspectedPair(mouse1, mouse2, pairLabel)}
        {(mouse1 && !mouse2) && this.renderInspectedMouse(mouse1)}
      </div>
    );
  }

  public renderInspectedPair(leftMouse: BackpackMouseType, rightMouse: BackpackMouseType, label: string) {
    return(
      <div>
        <div className="inspect-title">{label}</div>
        <div className="pair-container">
          <div className="inspect-background" />
          {this.renderMouse(leftMouse, false)}
          {this.renderMouse(rightMouse, true)}
        </div>
      </div>
    );
  }

  public renderMouse(mouse: BackpackMouseType, flip: boolean) {
    const mouseImages = [mouse.baseImage];
    return (
      <div className="mouse-container">
        <StackedOrganism
          organism={mouse}
          organismImages={mouseImages}
          height={170}
          showSelection={false}
          showSex={true}
          showHetero={true}
          flipped={flip}
        />
        <div className="mouse-label">
          {mouse.sex === "female" ? "Mother" : "Father"}
        </div>
        {this.renderMouseInfo(mouse)}
      </div>
    );
  }

  public renderMouseInfo(mouse: BackpackMouseType) {
    const sexLabel = mouse.sex === "female" ? "Female" : "Male";
    const colorLabel = mouse.baseColor === "white" ? "Light brown fur" :
                       mouse.baseColor === "tan" ? "Medium brown fur" : "Dark brown fur";
    const genotypeLabel = this.getGenotypeLabel(mouse.genotype);
    return (
      <div className="mouse-info">
        <div className="info-row">
          <div className="info-type">Color: </div>
          <div className="info-data">{colorLabel}</div>
        </div>
        <div className="info-row">
          <div className="info-type">Sex: </div>
          <div className="info-data">{sexLabel}</div>
        </div>
        <div className="info-row">
          <div className="info-type">Genotype: </div>
          <div className="info-data" dangerouslySetInnerHTML={{
                __html: genotypeLabel
            }} />
        </div>
      </div>
    );
  }

  public getGenotypeLabel(genotype: string) {
    switch (genotype) {
      case "CC":
        return "R<sup>L</sup>R<sup>L</sup>";
      case "RR":
        return "R<sup>D</sup>R<sup>D</sup>";
      case "RC":
        return "R<sup>D</sup>R<sup>L</sup>";
      case "CR":
        return "R<sup>L</sup>R<sup>D</sup>";
      default:
        return "";
    }
  }

  public renderInspectedMouse(mouse: BackpackMouseType) {
    return(
      <div className="pair-container single">
        <div className="inspect-background single" />
        {this.renderMouse(mouse, false)}
      </div>
    );
  }
}
