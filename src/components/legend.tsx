import * as React from "react";

import "./legend.sass";

export class LegendComponent extends React.Component {

  public render() {
    return (
      <div className="legend" data-test="legend">
        <div className="grid-item item-top-left">
          <div className="key-circle female-color" data-test="legend-female" />
          <div>Female</div>
        </div>
        <div className="grid-item item-top-right">
          <div className="key-circle male-color" data-test="legend-male" />
          <div>Male</div>
        </div>
        <div className="grid-item item-bottom">
          <div className="key-circle heterozygote-color" data-test="legend-hetero" />
          <div>Heterozygote</div>
        </div>
      </div>
    );
  }
}
