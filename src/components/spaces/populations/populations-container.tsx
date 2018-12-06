import { inject, observer } from "mobx-react";
import * as React from "react";
import { PopulationsView } from "populations-react";
import { SizeMe } from "react-sizeme";
import { BaseComponent, IBaseProps } from "../../base";

import "./populations-container.sass";
import { ToolbarButton } from "../../../models/spaces/populations/populations";
import { AgentEnvironmentMouseEvent } from "populations.js";
import { BackpackMouse } from "../../../models/backpack-mouse";

import { EnvironmentColorType } from "../../../models/spaces/populations/mouse-model/mouse-populations-model";

interface SizeMeProps {
  size?: {
    width: number | null;
    height: number | null;
  };
}

interface IProps extends IBaseProps {}
interface IState {
}

@inject("stores")
@observer
export class PopulationsComponent extends BaseComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const populations = this.props.stores && this.props.stores.populations;

    if (populations && populations.interactive) {

      const buttonsOLD = populations.toolbarButtons.map( (button, i) => {
        const type = button.type || "button";
        switch (type) {
          case "checkbox":
            return (
              <label key={button.title}>
                { button.title }
                <input
                  key={button.title}
                  type="checkbox"
                  checked={button.value}
                  onChange={this.handleClickToolbarCheckbox(button)} />
              </label>
            );
          case "button":
          default:
            return (
              <button key={button.title} className="population-button"
                      onClick={button.action} data-test={button.title.replace(/ /g, "-")}>
                <svg className="icon">
                  <use xlinkHref={"#icon-inspect"} />
                </svg>
                <div className="label">{button.title}</div>
              </button>
            );
        }
      });

      const buttons = populations.toolbarButtons.map( (button, i) => {
        const type = button.type || "button";
        if (type === "button") {
          if (button.title === "Change") {
            // TODO: state not updating?
            const environmentColor: EnvironmentColorType = populations.model.environment;
            let colorReadable = "neutral";
            switch (environmentColor) {
              case "white":
                colorReadable = "light";
                break;
              case "brown":
                colorReadable = "dark";
                break;
              case "neutral":
                colorReadable = "neutral";
                break;
              default:
                colorReadable = "neutral";
            }
            const colorClass = "environment-box " + colorReadable;
            return (
              <button key={button.title} className="population-button"
                      onClick={button.action} data-test={button.title.replace(/ /g, "-")}>
                <div className={colorClass}>{colorReadable}</div>
                <div className="label">{button.title}</div>
              </button>
            );
          } else {
            return (
              <button key={button.title} className="population-button"
                      onClick={button.action} data-test={button.title.replace(/ /g, "-")}>
                <svg className="icon">
                  <use xlinkHref={"#icon-inspect"} />
                </svg>
                <div className="label">{button.title}</div>
              </button>
            );
          }
        }
      });

      const checkboxes = populations.toolbarButtons.map( (button, i) => {
        const type = button.type || "button";
        if (type === "checkbox") {
          return (
            <label key={button.title} className="check-container">
              <input
                key={button.title}
                className="population-checkbox"
                type="checkbox"
                checked={button.value}
                onChange={this.handleClickToolbarCheckbox(button)} />
              <span className="checkmark"/>
              <div className="label-holder">
                <div className="label">{ button.title }</div>
              </div>
            </label>
          );
        }
      });

      const runButtonLabel = populations.isPlaying ? "Pause" : "Run";
      const runButtonIcon = populations.isPlaying ? "#icon-pause" : "#icon-run";
      const runButtonClass = populations.isPlaying ? "pause" : "run";
      const inspectButtonClass = populations.mouseMode === "inspect" ? "button-active" : "button-inactive";
      const collectButtonClass = populations.mouseMode === "select" ? "button-active" : "button-inactive";
      return (
        <div>
          <SizeMe monitorHeight={true}>
            {({ size }: SizeMeProps) => {
              return (
                <div>
                  {
                    (size && size.width)
                    ? <PopulationsView
                        interactive={populations.interactive}
                        width={size.width}
                        agentClickDistance={20}
                        onAgentMouseEvent={this.handleAgentClicked} />
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
                <svg className="icon">
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
              <label className="check-container">
                <input
                  className="population-checkbox"
                  type="checkbox" />
                <span className="checkmark"/>
                <div className="label-holder">
                  <div className="label"><div>Females</div><div className="circle female"/></div>
                  <div className="label"><div>Males</div><div className="circle male"/></div>
                </div>
              </label>
              <label className="check-container">
                <input
                  className="population-checkbox"
                  type="checkbox" />
                <span className="checkmark"/>
                <div className="label-holder">
                  <div className="label"><div>Heterozygotes</div><div className="circle heterozygote"/></div>
                </div>
              </label>
              { checkboxes }
            </div>
          </div>
        </div>
      );
    }
  }

  private handleClickRunButton = () => {
    const populations = this.props.stores && this.props.stores.populations;
    if (populations) {
      populations.togglePlay();
    }
  }

  private handleClickInspectButton = () => {
    const populations = this.props.stores && this.props.stores.populations;
    if (populations) {
      populations.toggleInspectMode();
    }
  }

  private handleClickResetButton = () => {
    const populations = this.props.stores && this.props.stores.populations;
    if (populations) {
      populations.reset();
    }
  }

  private handleClickToolbarCheckbox = (button: ToolbarButton) => {
    return (event: React.ChangeEvent) => {
      const target = event.target;
      button.action((target as any).checked);
    };
  }

  private handleClickSelect = () => {
    const populations = this.props.stores && this.props.stores.populations;
    if (populations) {
      populations.toggleSelectionMode();
    }
  }

  private handleAgentClicked = (evt: AgentEnvironmentMouseEvent) => {
    const populations = this.props.stores && this.props.stores.populations;
    if (populations && populations.mouseMode === "select" && evt.type === "click" && evt.agents.mice) {
      const selectedMouse = evt.agents.mice;
      if (this.props.stores) {
        const backpack = this.props.stores.backpack;
        const backpackMouse = BackpackMouse.create({
          sex: selectedMouse.get("sex"),
          genotype: (selectedMouse as any)._genomeButtonsString()
        });
        const added = backpack.addCollectedMouse(backpackMouse);
        if (added){
          this.props.stores.populations.removeAgent(selectedMouse);
        }
      }
    }
  }
}
