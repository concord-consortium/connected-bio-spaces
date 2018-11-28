import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../../base";
import "./organism-view.sass";

const kDefaultMouseImage = "../../assets/mouse_beach.png";

interface IProps extends IBaseProps {
}
interface IState {
}

@inject("stores")
@observer
export class OrganismView extends BaseComponent<IProps, IState> {

  public render() {
    const { backpack } = this.stores;
    const mouseStyle = {
      backgroundImage: `url(${kDefaultMouseImage})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
      width: "256px",
      height: "256px"
    };
    if (backpack.collectedMice && backpack.collectedMice.length > 0) {
      const mouse = backpack.collectedMice[0];
      mouseStyle.backgroundImage = `url(${mouse.baseImage})`;
    }

    return (
        <div className="organism-view" style={mouseStyle}>Mouse</div>
    );
  }
}
