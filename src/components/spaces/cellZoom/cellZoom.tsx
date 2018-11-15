import { inject, observer } from "mobx-react";
import * as React from "react";
import { PopulationsView } from "populations-react";
import { BaseComponent, IBaseProps } from "../../base";
import App from "connected-bio";

import "../populations/populations.sass";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class CellZoomComponent extends BaseComponent<IProps, IState> {

  public render() {
    return <App />;
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
