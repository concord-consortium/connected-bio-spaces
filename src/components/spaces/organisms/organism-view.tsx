import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../../base";
import "./organism-view.sass";
import { BackpackMouseType } from "../../../models/backpack-mouse";

const kDefaultMouseImage = "../../assets/mouse_collect.png";

interface IProps extends IBaseProps {
  backpackMouse?: BackpackMouseType;
  width: number;
}
interface IState {
}

@inject("stores")
@observer
export class OrganismView extends BaseComponent<IProps, IState> {

  public render() {
    const { backpackMouse, width } = this.props;
    const mouseImage = backpackMouse ? backpackMouse.baseImage : kDefaultMouseImage;

    const mouseStyle: React.CSSProperties = {
      backgroundImage: `url(${mouseImage})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
      backgroundPositionX: "center"
    };
    if (width) {
      mouseStyle.width = `${width}px`;
    }

    const mouseDescription = backpackMouse ? `Mouse: ${backpackMouse.baseColor}` : "";

    return (
      <div className="organism-view-container">
        <div className="organism-description" data-test="organism-description">{mouseDescription}</div>
        {backpackMouse &&
          <div className="organism-view" style={mouseStyle} data-test="organism-view" />
        }
      </div>
    );
  }
}
