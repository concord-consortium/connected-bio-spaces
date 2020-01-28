import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../../base";
import { ToolbarButton } from "../../../models/spaces/populations/populations";
import { NestingView } from "./nesting-view";
import "./breeding-container.sass";
import { BreedingView } from "./breeding-view";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class BreedingContainer extends BaseComponent<IProps, IState> {

  public render() {
    const { breeding } = this.stores;

    const checkboxes = breeding.toolbarButtons.map( (button, i) => {
      const type = button.type || "button";
      if (type === "checkbox") {
        const checkClass = button.enabled === false ? "check-container disabled" : "check-container";
        return (
          <label key={button.title} className={checkClass}>
            <input
              key={button.title}
              className="breeding-checkbox"
              type="checkbox"
              checked={button.value}
              onChange={this.handleClickToolbarCheckbox(button)} />
            <span className="checkmark"/>
            <div className="label-holder">
              { this.renderCheckBoxLabel(button.title, button.imageClass) }
              { button.secondaryTitle && button.secondaryTitleImageClass
                  ? this.renderCheckBoxLabel(button.secondaryTitle, button.secondaryTitleImageClass)
                  : null
              }
            </div>
          </label>
        );
      }
    });

    const showingNesting = breeding.breedingNestPairId === undefined;
    const breedButtonClass = "breed " + (showingNesting && breeding.interactionMode === "breed" ?
      "sticky-breed " : "sticky-breed-off ");
    const gametesButtonClass = "gametes disabled";
    const inspectButtonClass = breeding.interactionMode === "inspect" ? "sticky" : "sticky-off";
    const collectButtonClass = breeding.interactionMode === "select" ? "sticky-alt" : "sticky-alt-off";
    const containerClass = "breeding-container" + (breeding.interactionMode === "inspect" ? " inspect" : "")
                    + (breeding.interactionMode === "select" ? " select" : "")
                    + (breeding.interactionMode === "breed" ? " breed" : "");

    const mainComponent = showingNesting ? <NestingView /> : <BreedingView />;
    const switchLevelsButtonLabel = showingNesting ? "Breeding" : "Nesting";
    const switchLevelsIcon = showingNesting ? "breed" : "nests";

    return(
      <div>
        <div className={containerClass}>
            { mainComponent }
          </div>
        <div className="breeding-toolbar" data-test="breed-toolbar">
            <div className="toolbar-row">
              <button className={"breeding-button " + breedButtonClass}
                      onClick={showingNesting ? this.handleClickBreedButton : this.handleClickNestingButton}
                      data-test="breed-button">
                <div className="inner-box">
                  <svg className={"icon " + breedButtonClass}>
                    <use xlinkHref={`#icon-${switchLevelsIcon}`} />
                  </svg>
                </div>
                <div className="label">{switchLevelsButtonLabel}</div>
              </button>
              <button className={"breeding-button " + gametesButtonClass}
                      onClick={this.handleClickBreedButton} data-test="gametes-button">
                <div className="horizontal-container">
                  <div className="inner-box left">
                    <div className="label">Hide</div>
                  </div>
                  <div className="inner-box right">
                    <svg className={"icon " + gametesButtonClass}>
                      <use xlinkHref="#icon-gametes" />
                    </svg>
                    <div className="label">Show</div>
                  </div>
                </div>
                <div className="label">Inspect Gametes</div>
              </button>
              <button className={"breeding-button " + inspectButtonClass}
                      onClick={this.handleClickInspectButton} data-test="inspect-button">
                <svg className={"icon " + inspectButtonClass}>
                  <use xlinkHref="#icon-inspect" />
                </svg>
                <div className="label">Inspect</div>
              </button>
              <button className={"breeding-button " + collectButtonClass}
                      onClick={this.handleClickSelect} data-test="collect-button">
                <svg className={"icon " + collectButtonClass}>
                  <use xlinkHref="#icon-collect" />
                </svg>
                <div className="label">Collect</div>
              </button>
           </div>
            <div className="toolbar-row align-left">
              { checkboxes }
            </div>
          </div>

      </div>
    );
  }

  private renderCheckBoxLabel = (title?: string, imageClass?: string) => {
    return (
      <div className="label">
        <div>{ title }</div>
        {
          imageClass
            ?  <div className={imageClass} />
            :  null
        }
      </div>
    );
  }

  private handleClickBreedButton = () => {
    this.stores.breeding.toggleInteractionMode("breed");
    this.stores.breeding.setInspectedNest("");
  }

  private handleClickNestingButton = () => {
    this.stores.breeding.clearNestPairActiveBreeding();
  }

  private handleClickInspectButton = () => {
    this.stores.breeding.toggleInteractionMode("inspect");
  }

  private handleClickSelect = () => {
    this.stores.breeding.toggleInteractionMode("select");
  }

  private handleClickToolbarCheckbox = (button: ToolbarButton) => {
    return (event: React.ChangeEvent) => {
      const target = event.target;
      button.action((target as any).checked);
    };
  }
}
