import { inject, observer } from "mobx-react";
import * as React from "react";
import { PopulationsView } from "populations-react";
import { SizeMe } from "react-sizeme";
import { BaseComponent, IBaseProps } from "../../base";

import "./populations.sass";
import { ToolbarButton } from "../../../models/spaces/populations/populations";
import { AgentEnvironmentMouseEvent } from "populations.js";
import { Mouse } from "../../../models/mouse";

interface SizeMeProps {
  size?: {
    width: number | null;
    height: number | null;
  };
}

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class PopulationsComponent extends BaseComponent<IProps, IState> {

  public render() {
    const populations = this.props.stores && this.props.stores.populations;

    if (populations && populations.interactive) {

      const buttons = populations.toolbarButtons.map( button => {
        const type = button.type || "button";
        switch (type) {
          case "checkbox":
            return (
              <label>
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
            return (<button key={button.title} onClick={button.action}>{button.title}</button>);
        }
      });

      const runButtonLabel = populations.isPlaying ? "Pause" : "Run";
      return (
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
                <div className="populations-toolbar">
                  <button onClick={this.handleClickRunButton}>{runButtonLabel}</button>
                  <button onClick={this.handleClickResetButton}>Reset</button>
                  { buttons }
                </div>
              </div>
            );
          }}
        </SizeMe>
      );
    }
  }

  private handleClickRunButton = () => {
    const populations = this.props.stores && this.props.stores.populations;
    if (populations) {
      populations.togglePlay();
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

  private handleAgentClicked = (evt: AgentEnvironmentMouseEvent) => {
    if (evt.type === "click" && evt.agents.mice) {
      const selectedMouse = evt.agents.mice;
      if (this.props.stores) {
        const backpack = this.props.stores.backpack;
        const backpackMouse = Mouse.create({
          sex: selectedMouse.get("sex"),
          genotype: (selectedMouse as any)._genomeButtonsString()
        });
        backpack.addCollectedMouse(backpackMouse);

        this.props.stores.populations.removeAgent(selectedMouse);
      }
    }
  }
}
