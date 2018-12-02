import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../../base";
import "./organism-view.sass";
import { BackpackMouseType } from "../../../models/backpack-mouse";

const kDefaultMouseImage = "../../assets/mouse_beach.png";

interface IProps extends IBaseProps {
  backpackMouse?: BackpackMouseType;
}
interface IState {
}

@inject("stores")
@observer
export class OrganismView extends BaseComponent<IProps, IState> {

  public render() {
    const { backpackMouse } = this.props;
    const mouseImage = backpackMouse ? backpackMouse.baseImage : kDefaultMouseImage;

    const mouseStyle = {
      backgroundImage: `url(${mouseImage})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain"
    };

    const mouseDescription = backpackMouse ? `Mouse: ${backpackMouse.baseColor}` : "";

    return (
      <div className="organism-view-container">
        <div className="organism-description">{mouseDescription}</div>
        <div className="organism-view" style={mouseStyle} />
      </div>
    );
  }
}
