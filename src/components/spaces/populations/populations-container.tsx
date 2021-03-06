import { inject, observer } from "mobx-react";
import * as React from "react";
import { PopulationsView } from "populations-react";
import { BaseComponent, IBaseProps } from "../../base";

import "./populations-container.sass";
import { ToolbarButton } from "../../../models/spaces/populations/populations";
import { AgentEnvironmentMouseEvent, Agent } from "populations.js";
import { BackpackMouse } from "../../../models/backpack-mouse";

import { EnvironmentColorType,
  EnvironmentColorNames } from "../../../models/spaces/populations/mouse-model/mouse-populations-model";
import { DEFAULT_MODEL_WIDTH } from "../../..";

interface IProps extends IBaseProps {}
interface IState {
}

let currentHighlightMouse: Agent | undefined;
let firstMount = true;

@inject("stores")
@observer
export class PopulationsComponent extends BaseComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props);
  }

  public componentDidMount() {
    if (this.stores.populations && firstMount) {
      // only initialize the populations graph on the very first mount.
      // from then on, the graph will only be re-initialized when the user
      // explicitly resets the model
      setTimeout(this.stores.populations.initializeGraph, 1000);
    }
    firstMount = false;
  }

  public componentWillUnmount() {
    if (this.stores.populations) this.stores.populations.close();
  }

  public render() {
    const {populations, ui} = this.stores;

    if (populations && populations.interactive) {
      const buttons = populations.toolbarButtons.map( (button, i) => {
        const type = button.type || "button";
        if (type === "button") {
          const buttonClass = button.enabled === false ? "population-button disabled" : "population-button";
          const iconName = "#" + button.iconName;
          return (
            <button key={button.title} className={buttonClass}
                    onClick={button.action} data-test={button.title.replace(/ /g, "-")}>
              { button.title === "Change"
                  ? this.renderChangeButtonText(populations.model.environment)
                  : <svg className="icon">
                      <use xlinkHref={iconName} />
                    </svg>
              }
              <div className="label">{button.title}</div>
            </button>
          );
        }
      });

      const checkboxes = populations.toolbarButtons.map( (button, i) => {
        const type = button.type || "button";
        if (type === "checkbox") {
          const checkClass = button.enabled === false ? "check-container disabled" : "check-container";
          return (
            <label key={button.title} className={checkClass}>
              <input
                key={button.title}
                className="population-checkbox"
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

      const runButtonLabel = populations.isPlaying ? "Pause" : "Run";
      const runButtonIcon = populations.isPlaying ? "#icon-pause" : "#icon-run";
      const runButtonClass = populations.isPlaying ? "sticky" : "sticky-inactive";
      const inspectButtonClass = populations.interactionMode === "inspect" ? "sticky" : "sticky-off";
      const collectButtonClass = populations.interactionMode === "select" ? "sticky-alt" : "sticky-alt-off";
      let containerClass = "populations-container " + (populations.interactionMode === "inspect" ? "inspect" : "");
      containerClass = containerClass + (populations.interactionMode === "select" ? "select" : "");
      return (
        <div>
          <div className={containerClass}>
            <PopulationsView
              interactive={populations.interactive}
              width={DEFAULT_MODEL_WIDTH}
              agentClickDistance={20}
              onAgentMouseEvent={this.handleAgentMouseEvent} />
          </div>
          <div className="populations-toolbar" data-test="pop-toolbar">
            <div className="toolbar-row" data-test="pop-toolbar-main-buttons">
              <button className={"population-button " + runButtonClass}
                      onClick={this.handleClickRunButton} data-test="run-button">
                <svg className={"icon " + runButtonClass}>
                  <use xlinkHref={runButtonIcon} />
                </svg>
                <div className="label">{runButtonLabel}</div>
              </button>
              { buttons }
              <button className={"population-button " + inspectButtonClass}
                      onClick={this.handleClickInspectButton} data-test="inspect-button">
                <svg className={"icon " + inspectButtonClass}>
                  <use xlinkHref="#icon-inspect" />
                </svg>
                <div className="label">Inspect</div>
              </button>
              { ui.showLeftPanel &&
                <button className={"population-button " + collectButtonClass}
                        onClick={this.handleClickSelect} data-test="collect-button">
                  <svg className={"icon " + collectButtonClass}>
                    <use xlinkHref="#icon-collect" />
                  </svg>
                  <div className="label">Collect</div>
                </button>
              }
              <button className="population-button" onClick={this.handleClickResetButton} data-test="reset-button">
                <svg className="icon">
                  <use xlinkHref="#icon-reset" />
                </svg>
                <div className="label">Reset</div>
              </button>
            </div>
            <div className="toolbar-row">
              { checkboxes }
            </div>
          </div>
        </div>
      );
    }
  }

  private renderChangeButtonText = (environmentColor: EnvironmentColorType) => {
    const colorReadable = EnvironmentColorNames[environmentColor];
    const colorClass = "environment-box " + colorReadable;
    return (
      <div className={colorClass}>{colorReadable}</div>
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

  private handleClickRunButton = () => {
    this.stores.populations!.togglePlay();
  }

  private handleClickInspectButton = () => {
    this.stores.populations!.toggleInteractionMode("inspect");
  }

  private handleClickResetButton = () => {
    this.stores.populations!.reset();
  }

  private handleClickToolbarCheckbox = (button: ToolbarButton) => {
    return (event: React.ChangeEvent) => {
      const target = event.target;
      button.action((target as any).checked);
    };
  }

  private handleClickSelect = () => {
    this.stores.populations!.toggleInteractionMode("select");
  }

  private handleAgentMouseEvent = (evt: AgentEnvironmentMouseEvent) => {
    const populations = this.stores.populations;
    const evtType = evt.type === "touchstart" ? "click" : evt.type;   // merge touchstart and click
    if (populations) {
      if (evt.agents && evt.agents.mice) {
        if (evtType === "click" && populations.interactionMode === "select") {
          const selectedMouse = evt.agents.mice;
          const backpack = this.stores.backpack;
          const backpackMouse = BackpackMouse.create({
            species: "mouse",
            sex: selectedMouse.get("sex"),
            genotype: (selectedMouse as any)._genomeButtonsString()
          });
          const added = backpack.addCollectedMouse(backpackMouse);
          if (added){
            this.stores.populations!.removeAgent(selectedMouse);
          }
        } else if (evtType === "click" && populations.interactionMode === "inspect") {
          const selectedMouse = evt.agents.mice;
          const mouse = BackpackMouse.create({
            species: "mouse",
            sex: selectedMouse.get("sex"),
            genotype: (selectedMouse as any)._genomeButtonsString()
          });
          populations.model.setInspectedMouse(mouse);
          populations.setRightPanel("information");
        } else if (evtType === "mousemove" && populations.interactionMode !== "none") {
          if (currentHighlightMouse) {
            currentHighlightMouse.set("hover", "");
          }
          currentHighlightMouse = evt.agents.mice;
          currentHighlightMouse.set("hover", populations.interactionMode);
        }
      } else if (currentHighlightMouse) {
        currentHighlightMouse.set("hover", "");
      }
    }
  }
}
