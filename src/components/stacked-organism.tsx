import * as React from "react";
import { BackpackMouseType } from "../models/backpack-mouse";
import { speciesDef } from "../models/units";
import "./stacked-organism.sass";
import "./stacked-organism.pea.sass";

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
  ignoreHeteroStyleAdjustment?: boolean;
}

const path = "assets/unit/mouse/populations/";
const selectionImage =  path + "select-stack.png";

export const StackedOrganism: React.SFC<IProps> = (props) => {
  const { organism, organismImages, height, flipped, showSelection, showGameteSelection, showInspect, showSex,
    showHetero, showLabel, isOffspring, ignoreHeteroStyleAdjustment } = props;
  const selectionClass = "selection-stack " + (showSelection ? "show" : "");
  const gameteViewClass = "gamete-view-stack " + ((showGameteSelection && !showSelection) ? "show" : "");
  const inspectClass = "inspect-stack";
  const heteroClass = "hetero-stack " + ((showHetero && organism.isHeterozygote) ? "show" : "");
  const sexClass = "sex-stack " + organism.sex + (showSex ? " show" : "");
  const imgClasses = "organism-image " + (flipped ? "flip" : "");
  const species = speciesDef(organism.species);
  const label = species.getGenotypeHTMLLabel(organism.genotype);
  const labelClass = "genotype-label " + (isOffspring ? "child-mouse" : "parent-mouse");
  // sizes defined here instead of in css so we can base width and left dimension off height dimension
  const fullSize = { height, width: height };

  const normalHeight = 150;
  const normalBorderWidth = 4;
  const sexSize = {
    height: height * .9,
    width: height * .9,
    borderWidth: (normalBorderWidth * height / normalHeight)
  };
  const heteroSize = ignoreHeteroStyleAdjustment
    ? undefined
    : {
        height: height * .78,
        width: height * .78,
        borderWidth: (normalBorderWidth * height / normalHeight)
      };

  return (
    <div className={`stacked-organism ${organism.species}`} style={fullSize}>
      { showGameteSelection && <div className={gameteViewClass} style={fullSize} data-test="gamete-view" /> }
      { (showInspect && !showGameteSelection) &&
        <div className={inspectClass} style={fullSize} data-test="inspect-view" /> }
      <img src={selectionImage} className={selectionClass} style={fullSize} data-test="selection-image" />
      { showLabel && <div className={labelClass} dangerouslySetInnerHTML={{ __html: label }}/> }
      { organismImages.map((image, i) =>
          <img
            src={image}
            className={imgClasses}
            key={`org-image-${i}`}
            data-test={`org-image-${i}`}
          />)
      }
      <div className={sexClass} style={sexSize}/>
      <div className={heteroClass} style={heteroSize}/>
    </div>
  );

};
