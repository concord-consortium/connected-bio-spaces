import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../../base";
import "./organism-view.sass";
import { BackpackMouseType } from "../../../models/backpack-mouse";
require("gifler");
const gifler = (window as any).gifler;

const kDefaultMouseImage = "../../assets/mouse_collect.png";

interface IProps extends IBaseProps {
  backpackMouse?: BackpackMouseType;
  zoomIn: boolean;
  onZoomInComplete?: () => void;
}
interface IState {
}

@inject("stores")
@observer
export class OrganismView extends BaseComponent<IProps, IState> {

  private canvasElRef: React.RefObject<{}>|null = null;
  private animator: any;

  public render() {
    return (
      <div className="organism-view-container">
        <canvas style={{width: "100%"}} ref={this.setCanvasElRef} />
      </div>
    );
  }

  public componentDidMount() {
    this.initializeImage();
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  }

  public componentWillUnmount() {
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
  }

  public componentDidUpdate(prevProps: IProps) {
    if (this.props.backpackMouse && this.props.backpackMouse !== prevProps.backpackMouse) {
      this.initializeImage();
    }
    if (this.props.zoomIn && !prevProps.zoomIn) {
      this.startZoom();
    }
  }

  private initializeImage = () => {
    const { backpackMouse } = this.props;
    const mouseImage = backpackMouse && backpackMouse.zoomImage;
    if (mouseImage) {
      gifler(mouseImage)
        .get((animator: any) => {
          this.animator = animator;
          animator.animateInCanvas(this.canvasElRef);
          animator.stop();
          const firstFrame = animator._frames[0];
          animator.onFrame(firstFrame);

          animator.onDrawFrame = (ctx: any, frame: any, i: number) => {
            ctx.drawImage(frame.buffer, frame.x, frame.y);
            if (i === animator._frames.length - 1) {
              this.handleAnimationFinished();
            }
          };
        });
    }
  }

  private startZoom = () => {
    if (!this.animator) return;
    this.animator._loopCount = 1;
    this.animator._loops = 1;
    this.animator.start();
  }

  private handleAnimationFinished = () => {
    this.props.onZoomInComplete && this.props.onZoomInComplete();
  }

  private setCanvasElRef = (element: any) => this.canvasElRef = element;

  // Gifler freezes if we tab away and return.
  private handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      // If we return to being visible, that means we had tabbed away
      // from the model, and we need to jump to the completed animation
      if (this.animator) {
        this.animator.stop();
        this.handleAnimationFinished();
      }
    }
  }
}
