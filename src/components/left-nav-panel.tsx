import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./left-nav-panel.sass";
import { ExploreButtonComponent } from "./explore-button";
import { CollectButtonComponent } from "./collect-button";
import { LegendComponent } from "./legend";

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
        <div className="header collect">
        Sample
        </div>
        {this.renderCollectButtons()}
        <div className="footer">
          <LegendComponent/>
        </div>
      </div>
    );
  }

  private renderExploreButtons = () => {
    const {ui, populations, organisms, breeding} = this.stores;
    const showPopulationSpace = ui.showPopulationSpace && populations;
    const showOrganismSpace = ui.showOrganismSpace && organisms;
    const showBreedingSpace = ui.showBreedingSpace && breeding;
    const showDNASpace = false;   // eventually use ui.showDNASpace && dna
    return (
      <div className="button-holder investigate" data-test="explore-options">
        {showPopulationSpace &&
        <ExploreButtonComponent
          space={"populations"}
          title={"Population"}
        /> }
        {showOrganismSpace &&
        <ExploreButtonComponent
          space={"organism"}
          title={"Organism"}
        /> }
        {showBreedingSpace &&
        <ExploreButtonComponent
          space={"breeding"}
          title={"Heredity"}
        /> }
        {showDNASpace &&
        <ExploreButtonComponent
          space={"dna"}
          title={"DNA"}
        /> }
      </div>
    );
  }

  private renderCollectButtons = () => {
    const {backpack} = this.stores;
    const collectedSlots = backpack.collectedMice.length;
    const emptySlots = backpack.maxSlots - collectedSlots;
    const buttons = backpack.collectedMice.map((collectedMouse, index) => {
                      return <CollectButtonComponent
                               backpackMouse={collectedMouse}
                               key={index}
                               index={index + 1}
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
        backpackMouse={undefined}
        key={index}
        index={index + 1}
      />
    );
  }

}
