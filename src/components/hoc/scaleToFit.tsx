import * as React from "react";
import * as Dimensions from "react-dimensions";

interface StyleOptions {
  className?: string;
}

interface ContainerSize {
  width: number;
  height: number;
}

interface RequestedSize extends ContainerSize {
  minWidth: number;
  minHeight: number;
}

type SizeFunction = (props?: any) => RequestedSize;

interface WrappedComponentProps {
  containerWidth: number;
  containerHeight: number;
  content: {
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
  };
}

/*
  Higher-order component (HOC) that uses the PropsProxy pattern
  (https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e)
  to determine the scale factor required to fit the WrappedComponent into its container.

  To use this HOC, caller may provide a `dimensionsOptions` object (which is passed to the
  Dimensions HOC (https://github.com/digidem/react-dimensions) and a `contentFn`, which should
  return the size of the content to be accommodated. To the resulting component, the caller
  must also provide a `content` property which is an object with the following members:
  - width {number} the width of the content
  - height {number} the height of the content
  - minWidth {number} [optional] the minimum width of the content; if present,
              the width below which scaling will stop and scrolling will be enabled
  - minHeight {number} [optional] the minimum height of the content; if present,
              the height below which scaling will stop and scrolling will be enabled

  This HOC will then provide the following properties to the WrappedComponent:
  - scale {number} the numeric scale factor to apply, e.g. `0.75` for 75%
  - style {object} an object of the form { transform: `scale(${scale})` }
          which can be applied to a React component/DOM element to enable the transform.
 */
export default function scaleToFit(outerWrapperStyle: StyleOptions, center: boolean, sizeFunction: SizeFunction) {

  function calcScaleFactor(outerElement: ContainerSize, requestedSize: RequestedSize, allowGrowth: boolean) {
    if (!allowGrowth) {
      // if there's enough room, then no scaling required (we don't scale up)
      if ((outerElement.width >= requestedSize.width) &&
          (outerElement.height >= requestedSize.height)) {
        return 1.0;
      }
    }
    // if scaling is required, figure out the controlling dimension
    // contentLimit is the container size limited by minimum content constraints
    const contentLimitWidth = Math.max(outerElement.width, requestedSize.minWidth || requestedSize.width);
    const contentLimitHeight = Math.max(outerElement.height, requestedSize.minHeight || requestedSize.height);
    const contentLimitAspect = contentLimitWidth / contentLimitHeight;
    const contentAspect = requestedSize.width / requestedSize.height;

    // width is the constraining dimension
    return contentLimitAspect <= contentAspect
              ? contentLimitWidth / requestedSize.width    // width is constraining dimension
              : contentLimitHeight / requestedSize.height; // height is constraining dimension
  }

  function scaledComponent(WrappedComponent: React.ComponentType) {
    return class extends React.Component<WrappedComponentProps> {

      public render() {
        const { containerWidth, containerHeight, ...otherProps } = this.props;
        const container = { width: containerWidth, height: containerHeight };
        const requestedSize = sizeFunction(this.props);
        const scale = calcScaleFactor(container, requestedSize, true);
        const style: any = {
          transform: `scale(${scale})`,
          width: `${requestedSize.width}px`,
          height: `${requestedSize.height}px`
        };
        if (center) {
          style.transform = "translate(-50%, 0) " + style.transform;
          style.position = "absolute";
          style.left = "50%";
        }

        (otherProps as any).style = style;
        (otherProps as any).scale = scale;

        return (
          <WrappedComponent {...otherProps} />
        );
      }
    };
  }

  return (WrappedComponent: React.ComponentType) => {
    return Dimensions(outerWrapperStyle)(scaledComponent(WrappedComponent));
  };
}
