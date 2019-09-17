import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../../base";
import "./organism-view.sass";

const kDefaultMouseImage = "../../assets/mouse_collect.png";

interface IProps extends IBaseProps {
  rowIndex: number;
  width: number;
}
interface IState {
}

/**
 * Temporary view of static images to demo nucleus view
 */

const nucleusImages = {
  decolored: {
    expanded: "assets/static-nucleus/dna-decolor.png",
    condensed: "assets/static-nucleus/dna-condensed-decolor.png"
  },
  colored: {
    expanded: "assets/static-nucleus/dna-color.png",
    condensed: "assets/static-nucleus/dna-condensed-color.png"
  }
};

@inject("stores")
@observer
export class StaticNucleusView extends BaseComponent<IProps, IState> {

  public render() {
    const { width } = this.props;
    const row = this.getRow();

    const coloredState = row.nucleusColored ? "colored" : "decolored";
    const condensedState = row.nucleusCondensed ? "condensed" : "expanded";
    const nucleusImage = nucleusImages[coloredState][condensedState];

    const mouseStyle: React.CSSProperties = {
      backgroundImage: `url(${nucleusImage})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center"
    };
    if (width) {
      mouseStyle.width = `${width}px`;
    }

    return (
      <div className="organism-view-container">
        <div className="organism-view" style={mouseStyle} data-test="nucleus-view" />
      </div>
    );
  }

  private getRow = () => {
    const { organisms } = this.stores;
    const { rowIndex } = this.props;
    return organisms.rows[rowIndex];
  }
}
