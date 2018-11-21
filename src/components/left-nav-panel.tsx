import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./left-nav-panel.sass";
import { ExploreButtonComponent } from "./explore-button";
import { CollectButtonComponent } from "./collect-button";
import { LegendComponent } from "./legend";
import { Mouse } from "../models/mouse";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class LeftNavPanelComponent extends BaseComponent<IProps, IState> {

  public render() {
    return (
      <div className="left-nav-panel">
        <div className="header investigate" >
        Explore
        </div>
        {this.renderExploreButtons()}
        <div className="header collect" data-test="backpack">
        Collect
        </div>
        {this.renderCollectButtons()}
        <div className="footer">
          <LegendComponent/>
        </div>
      </div>
    );
  }

  private renderExploreButtons = () => {
    return (
      <div className="button-holder investigate">
        <ExploreButtonComponent
          space={"populations"}
          title={"Population"}
        />
        <ExploreButtonComponent
          space={"breeding"}
          title={"Breeding"}
        />
        <ExploreButtonComponent
          space={"organism"}
          title={"Organism"}
        />
        <ExploreButtonComponent
          space={"dna"}
          title={"Protein/DNA"}
        />
      </div>
    );
  }

  private renderCollectButtons = () => {
    const {backpack} = this.stores;
    const {ui} = this.stores;
    const collectedSlots = backpack.collectedMice.length;
    const emptySlots = ui.availableBackpackSlots - collectedSlots;
    const buttons = backpack.collectedMice.map((slot, index) => {
                      return <CollectButtonComponent
                               mouse={slot}
                               index={index}
                               key={index}
                             />;
                    });
    for (let sl = 0; sl < emptySlots; sl++) {
      buttons.push(this.renderEmptyCollectButton(collectedSlots + sl));
    }
    return (
      <div className="button-holder collect" data-test="backpack-items">
        {buttons}
      </div>
    );
  }

  private renderEmptyCollectButton = (index: number) => {
    return (
      <CollectButtonComponent
        mouse={undefined}
        index={index}
        key={index}
      />
    );
  }

}
