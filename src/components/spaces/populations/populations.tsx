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
    const interactive = this.props.stores && this.props.stores.populations.interactive;

    if (interactive) {
      return (
        <div>
          <PopulationsView interactive={interactive} />
        </div>
      );
    }
  }

  private handleClickClose = () => {
    const {ui} = this.stores;
    { ui.setShowInvestigationPanel(!ui.setShowInvestigationPanel); }
  }

}
