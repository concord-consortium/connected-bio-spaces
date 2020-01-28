import * as React from "react";

import "./stacked-organism.sass";
import { BackpackMouseType } from "../models/backpack-mouse";

interface IProps {
  organism: BackpackMouseType;
  organismImages: string[];
  height: number;
  flipped?: boolean;
  showSelection: boolean;
  showSex: boolean;
  showHetero: boolean;
}

const path = "assets/curriculum/mouse/populations/";
const femaleSexImage =  path + "female-stack.png";
const maleSexImage =    path + "male-stack.png";
const heteroImage =     path + "heterozygous-stack.png";
const selectionImage =  path + "select-stack.png";

export const StackedOrganism: React.SFC<IProps> = (props) => {
  const selectionClass = "selection-stack " + (props.showSelection ? "show" : "");
  const heteroClass = "hetero-stack " + ((props.showHetero && props.organism.isHeterozygote) ? "show" : "");
  const sexImage = props.organism.sex === "female" ? femaleSexImage : maleSexImage;
  const sexClass = "sex-stack " + (props.showSex ? "show" : "");
  const imgClasses = "organism-image " + (props.flipped ? "flip" : "");

  // sizes defined here instead of in css so we can base width and left dimension off height dimension
  const fullSize = {
    height: props.height,
    width: props.height
  };
  const innerSize = {
    height: props.height * 0.7,
    left: props.flipped ? props.height * 0.05 : -props.height * 0.225
  };

  return (
    <div className="stacked-organism" style={fullSize}>
      <img src={selectionImage} className={selectionClass} style={fullSize} data-test="selection-image" />
      {
        props.organismImages.map((image, i) =>
          <img src={image} className={imgClasses} style={innerSize}
            key={`org-image-${i}`} data-test={`org-image-${i}`} />
        )
      }
      <img src={heteroImage} className={heteroClass} style={fullSize} data-test="hetero-image" />
      <img src={sexImage} className={sexClass} style={fullSize} data-test="sex-image" />
    </div>
  );
};