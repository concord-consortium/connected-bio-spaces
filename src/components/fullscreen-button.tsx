import * as React from "react";
import * as screenfull from "screenfull";

import "./fullscreen-button.sass";

interface IProps {
  className?: string;
  onFullscreenChange?: (isFullscreen: boolean) => void;
}

interface IState {
  isFullscreen: boolean;
}

export class FullScreenButton extends React.Component<IProps, IState> {

  public state = {
    isFullscreen: false
  };

  public componentDidMount() {
    if (screenfull.isEnabled) {
      screenfull.on("change", () => {
        const isFullscreen = (screenfull as any).isFullscreen;
        this.setState({ isFullscreen });
        if (this.props.onFullscreenChange) {
          this.props.onFullscreenChange(isFullscreen);
        }
      });
    }
  }

  public render() {
    let className = `fullscreen-button-container ${this.props.className || ""}`;
    let iconName = "#icon-enter-fullscreen";
    if (this.state.isFullscreen) {
      className += " fullscreen";
      iconName = "#icon-exit-fullscreen";
    }

    return (
      <div className={className}>
        <div className="fullscreen-button-border" />
        <div className="fullscreen-button" onClick={this.toggleFullscreen}>
          <svg className="image">
            <use xlinkHref={iconName} />
          </svg>
        </div>
      </div>
    );
  }

  private toggleFullscreen() {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  }
}
