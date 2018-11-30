import { inject, observer } from "mobx-react";
import * as React from "react";
import { PopulationsView } from "populations-react";
import { SizeMe } from "react-sizeme";
import { BaseComponent, IBaseProps } from "../../base";

import "./populations.sass";
import { ToolbarButton } from "../../../models/spaces/populations/populations";
import { AgentEnvironmentMouseEvent } from "populations.js";
import { BackpackMouse } from "../../../models/backpack-mouse";

interface SizeMeProps {
  size?: {
    width: number | null;
    height: number | null;
  };
}

interface IProps extends IBaseProps {}
interface IState {
  selectMode: boolean;
  modelWasPlaying: boolean;
}

@inject("stores")
@observer
export class PopulationsComponent extends BaseComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      selectMode: false,
      modelWasPlaying: false
    };
  }

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
                  <div className="two-state-button">
                    <label>
                      <input
                        type="checkbox"
                        checked={this.state.selectMode}
                        onChange={this.handleClickSelect} />
                      <span>Select</span>
                    </label>
                  </div>
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

      if (this.state.selectMode && populations.isPlaying) {
        this.setState({selectMode: false});
      }
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
    this.setState({
      selectMode: !this.state.selectMode
    }, () => {
      const { populations } = this.props.stores!;
      if (this.state.selectMode) {
        this.setState({modelWasPlaying: populations.isPlaying});
        populations.pause();
      } else if (!this.state.selectMode && this.state.modelWasPlaying) {
        populations.play();
      }
    });
  }

  private handleAgentClicked = (evt: AgentEnvironmentMouseEvent) => {
    if (this.state.selectMode && evt.type === "click" && evt.agents.mice) {
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
