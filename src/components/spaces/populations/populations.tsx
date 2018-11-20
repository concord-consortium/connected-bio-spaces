import { inject, observer } from "mobx-react";
import * as React from "react";
import { PopulationsView } from "populations-react";
import { BaseComponent, IBaseProps } from "../../base";

import "./populations.sass";
import { ToolbarButton } from "../../../models/spaces/populations/populations";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class PopulationsComponent extends BaseComponent<IProps, IState> {

  public render() {
    const populations = this.props.stores && this.props.stores.populations;

    if (populations) {

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
      return (
        <div>
          <PopulationsView interactive={populations.interactive} />
          <div className="populations-toolbar">
            <button onClick={this.handleClickRunButton}>{populations.isPlaying ? "Pause" : "Run"}</button>
            <button onClick={this.handleClickResetButton}>Reset</button>
            { buttons }
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
}
