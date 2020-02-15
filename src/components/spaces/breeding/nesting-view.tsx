import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../../base";
import { NestPair } from "./nest-pair";

import "./nesting-view.sass";
import { INestPair } from "../../../models/spaces/breeding/breeding";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class NestingView extends BaseComponent<IProps, IState> {

  public render() {
    const { breeding } = this.stores;
    const showSelection = breeding.interactionMode === "select";
    const showNestHighlight = breeding.interactionMode === "breed";
    const showPairHighlight = breeding.interactionMode === "inspect";
    const nestPairs = breeding.nestPairs.map((nestPair: INestPair, index) => {
      return (
        <NestPair
          nestPair={nestPair}
          positionIndex={index + 1}
          showSexStack={breeding.showSexStack}
          showHeteroStack={breeding.showHeteroStack}
          showSelectionStack={showSelection}
          showNestHighlight={showNestHighlight}
          showPairHighlight={showPairHighlight}
          key={index}
        />
      );
    });
    const bgImage = breeding.backgroundImage;
    return(
      <div className="nesting-view">
        <img src={bgImage} className="background" data-test="background-image" />
        {nestPairs}
      </div>
    );
  }
}
