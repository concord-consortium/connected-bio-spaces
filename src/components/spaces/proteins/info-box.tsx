import * as React from "react";
import "./info-box.sass";
import AminoAcid from "./amino-acid";
import { getFullNameForAminoAcid, expandAminoAcidAbbreviation,
  getAminoAcidDescription } from "./util/amino-acid-utils";

interface InfoBoxProps {
  highlightColor?: string;
  aminoAcids: string;
  selection: number;
  marks?: number[];
  width: number;
  hovered: boolean;
  onHoverEnter: () => void;
  onHoverExit: () => void;
  onMarkLocation: (percent: number) => void;
}

interface DefaultProps {
  highlightColor: string;
  marks: number[];
}

type PropsWithDefaults = InfoBoxProps & DefaultProps;

const InfoBox: React.StatelessComponent<InfoBoxProps> = props => {
  const {selection, aminoAcids, marks, hovered} = props as PropsWithDefaults;

  const aminoAcid = aminoAcids.charAt(selection);

  const length = aminoAcids.length - 1;
  const marked = marks.includes(selection);

  function renderInfo(aminoAcidId: string) {
    const name = getFullNameForAminoAcid(aminoAcidId);
    const abbr = expandAminoAcidAbbreviation(aminoAcidId);

    const description = getAminoAcidDescription(aminoAcidId);

    return (
      <div className="info">
        <div className="symbol">
          { aminoAcidId !== "0" &&
            <svg viewBox="-5 -5 60 60" width="58px"
                onMouseEnter={props.onHoverEnter}
                onMouseLeave={props.onHoverExit}
                onClick={handleMarkLocation}>
              <AminoAcid type={aminoAcidId} width={50} marked={marked || hovered} />
            </svg>
          }
          <span className="heading">{abbr}</span>
        </div>
        <div className="name">
          <span className="heading">Name:</span> {name}
        </div>
        <div className="property">
          <span className="heading">Property:</span> {description}
        </div>
        <div className="aa-counter">
          <div>Amino acid</div>
          <div className="aa-number">{selection + 1}</div>
          <div>of {length}</div>
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
        </div>
      </div>
    </div>
  );
};

InfoBox.defaultProps = {
  highlightColor: "255, 255, 0",
  marks: []
};

export default InfoBox;
