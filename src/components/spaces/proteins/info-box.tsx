import * as React from "react";
import "./info-box.sass";
import AminoAcid from "./amino-acid";
import { getFullNameForAminoAcid, expandAminoAcidAbbreviation,
  getAminoAcidDescription } from "./util/amino-acid-utils";

interface InfoBoxProps {
  highlightColor?: string;
  aminoAcids: string;
  secondAminoAcids: string;
  selection: number;
  selectedAminoAcidXLocation: number;
  marks?: number[];
  width: number;
  onMarkLocation: (percent: number) => void;
}

interface DefaultProps {
  highlightColor: string;
  marks: number[];
}

type PropsWithDefaults = InfoBoxProps & DefaultProps;

const InfoBox: React.StatelessComponent<InfoBoxProps> = props => {
  const {selection, aminoAcids, secondAminoAcids, width, marks} = props as PropsWithDefaults;

  const aminoAcid = aminoAcids.charAt(selection);

  let secondAminoAcid;
  if (secondAminoAcids) {
    secondAminoAcid = secondAminoAcids.charAt(selection);
    if (secondAminoAcid === aminoAcid) {
      secondAminoAcid = null;
    }
  }

  // const style = {
  //   marginLeft: props.selectedAminoAcidXLocation - (width / 2),
  // };

  const length = aminoAcids.length;
  const marked = marks.includes(selection);

  function renderInfo(aminoAcidId: string) {
    const name = `${getFullNameForAminoAcid(aminoAcidId)} (${expandAminoAcidAbbreviation(aminoAcidId)})`;

    const description = getAminoAcidDescription(aminoAcidId);

    return (
      <div className="info">
        { aminoAcidId !== "0" &&
          <svg viewBox="0 0 30 30" width="30px">
            <AminoAcid type={aminoAcidId} width={30}/>
          </svg>
        }
        <div className="name">
          <b>Name:</b> {name}
        </div>
        <div className="property">
          <b>Property:</b> {description}
        </div>
      </div>
    );
  }

  function handleMarkLocation() {
    props.onMarkLocation(selection);
  }

  return (
    <div className="info-box-wrapper">
      <div className="info-box">
        <div className="info-wrapper">
          { renderInfo(aminoAcid) }
          { secondAminoAcid && renderInfo(secondAminoAcid) }
        </div>
        { aminoAcid !== "0" &&
          <div className="mark">
            <div>
              Amino acid {selection + 1} of {length}
            </div>
            <label>
              <input
                name="isGoing"
                type="checkbox"
                checked={marked}
                onChange={handleMarkLocation} />
                Mark this location
            </label>
          </div>
        }
      </div>
    </div>
  );
};

InfoBox.defaultProps = {
  highlightColor: "255, 255, 0",
  marks: []
};

export default InfoBox;
