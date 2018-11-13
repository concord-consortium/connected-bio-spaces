import { inject, observer } from "mobx-react";
import * as React from "react";
import { PopulationsView } from "populations-react";
import { BaseComponent, IBaseProps } from "../../base";

// import "./investigation-panel.sass";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class PopulationsComponent extends BaseComponent<IProps, IState> {

  public render() {
    const populations = this.props.stores && this.props.stores.populations;

    if (populations) {
      return (
        <div>
          <PopulationsView interactive={populations.interactive} />
          <div className="populations-toolbar">
            <button onClick={this.handleClickRunButton}>{populations.isPlaying ? "Pause" : "Run"}</button>
            <button onClick={this.handleClickResetButton}>Reset</button>
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
}
