import * as React from "react";
import { genotypeHTMLLabel } from "../utilities/genetics";
import "./stacked-organism.sass";
import { BackpackMouseType } from "../models/backpack-mouse";

interface IProps {
  organism: BackpackMouseType;
  organismImages: string[];
  height: number;
  flipped?: boolean;
  showSelection: boolean;
  showGameteSelection?: boolean;
  showInspect?: boolean;
  showSex: boolean;
  showHetero: boolean;
  showLabel?: boolean;
  isOffspring?: boolean;
}

const path = "assets/curriculum/mouse/populations/";
const selectionImage =  path + "select-stack.png";

export const StackedOrganism: React.SFC<IProps> = (props) => {
  const selectionClass = "selection-stack " + (props.showSelection ? "show" : "");
  const gameteViewClass = "gamete-view-stack " + (props.showGameteSelection ? "show" : "");
  const inspectClass = "inspect-stack";
  const heteroClass = "hetero-stack " + ((props.showHetero && props.organism.isHeterozygote) ? "show" : "");
  const sexClass = "sex-stack " + props.organism.sex + (props.showSex ? " show" : "");
  const imgClasses = "organism-image " + (props.flipped ? "flip" : "");
  const label = genotypeHTMLLabel(props.organism.genotype);
  const labelClass = "genotype-label " + (props.isOffspring ? "child-mouse" : "parent-mouse");
  // sizes defined here instead of in css so we can base width and left dimension off height dimension
  const fullSize = {
    height: props.height,
    width: props.height
  };
  const innerSize = {
    height: props.height * 0.45,
  };
  const normalHeight = 150;
  const normalBorderWidth = 4;
  const sexSize = {
    height: props.height * .9,
    width: props.height * .9,
    borderWidth: (normalBorderWidth * props.height / normalHeight)
  };
  const heteroSize = {
    height: props.height * .78,
    width: props.height * .78,
    borderWidth: (normalBorderWidth * props.height / normalHeight)
  };

  return (
    <div className="stacked-organism" style={fullSize}>
      { props.showGameteSelection && <div className={gameteViewClass} style={fullSize} data-test="gamete-view" /> }
      { props.showInspect && <div className={inspectClass} style={fullSize} data-test="inspect-view" /> }
      { props.showLabel && <div className={labelClass} dangerouslySetInnerHTML={{ __html: label }}/> }
      <img src={selectionImage} className={selectionClass} style={fullSize} data-test="selection-image" />
      {
        props.organismImages.map((image, i) =>
          <img src={image} className={imgClasses} style={innerSize}
            key={`org-image-${i}`} data-test={`org-image-${i}`} />
        )
      }
      <div className={sexClass} style={sexSize}/>
      <div className={heteroClass} style={heteroSize}/>
    </div>
  );

};
