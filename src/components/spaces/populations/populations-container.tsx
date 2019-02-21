import { inject, observer } from "mobx-react";
import * as React from "react";
import { PopulationsView } from "populations-react";
import { SizeMe } from "react-sizeme";
import { BaseComponent, IBaseProps } from "../../base";

import "./populations-container.sass";
import { ToolbarButton } from "../../../models/spaces/populations/populations";
import { AgentEnvironmentMouseEvent, Agent } from "populations.js";
import { BackpackMouse } from "../../../models/backpack-mouse";

import { EnvironmentColorType,
  EnvironmentColorNames } from "../../../models/spaces/populations/mouse-model/mouse-populations-model";

interface SizeMeProps {
  size?: {
    width: number | null;
    height: number | null;
  };
}

interface IProps extends IBaseProps {}
interface IState {
}

let currentHighlightMouse: Agent | undefined;

@inject("stores")
@observer
export class PopulationsComponent extends BaseComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props);
  }

  public componentWillUnmount() {
    this.stores.populations.close();
  }

  public render() {
    const populations = this.stores.populations;

    if (populations && populations.interactive) {
      const buttons = populations.toolbarButtons.map( (button, i) => {
        const type = button.type || "button";
        if (type === "button") {
          const buttonClass = button.enabled === false ? "population-button disabled" : "population-button";
          const iconName = "#icon-" + button.title.toLowerCase();
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
          <SizeMe monitorHeight={true}>
            {({ size }: SizeMeProps) => {
              return (
                <div className={containerClass}>
                  {
                    (size && size.width)
                    ? <PopulationsView
                        interactive={populations.interactive}
                        width={size.width}
                        agentClickDistance={20}
                        onAgentMouseEvent={this.handleAgentMouseEvent} />
                    : null
                  }
                </div>
              );
            }}
          </SizeMe>
          <div className="populations-toolbar" data-test="pop-toolbar">
            <div className="toolbar-row">
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
              <button className={"population-button " + collectButtonClass}
                      onClick={this.handleClickSelect} data-test="collect-button">
                <svg className={"icon " + collectButtonClass}>
                  <use xlinkHref="#icon-collect" />
                </svg>
                <div className="label">Collect</div>
              </button>
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
    this.stores.populations.togglePlay();
  }

  private handleClickInspectButton = () => {
    this.stores.populations.toggleInteractionMode("inspect");
  }

  private handleClickResetButton = () => {
    this.stores.populations.reset();
  }

  private handleClickToolbarCheckbox = (button: ToolbarButton) => {
    return (event: React.ChangeEvent) => {
      const target = event.target;
      button.action((target as any).checked);
    };
  }

  private handleClickSelect = () => {
    this.stores.populations.toggleInteractionMode("select");
  }

  private handleAgentMouseEvent = (evt: AgentEnvironmentMouseEvent) => {
    const populations = this.stores.populations;
    if (populations) {
      if (evt.agents && evt.agents.mice) {
        if (evt.type === "click" && populations.interactionMode === "select") {
          const selectedMouse = evt.agents.mice;
          const backpack = this.stores.backpack;
          const backpackMouse = BackpackMouse.create({
            sex: selectedMouse.get("sex"),
            genotype: (selectedMouse as any)._genomeButtonsString()
          });
          const added = backpack.addCollectedMouse(backpackMouse);
          if (added){
            this.stores.populations.removeAgent(selectedMouse);
          }
        } else if (evt.type === "mousemove" && populations.interactionMode !== "none") {
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
