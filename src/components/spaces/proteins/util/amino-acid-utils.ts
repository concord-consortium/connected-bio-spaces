require("../../../../utilities/polyfills");

interface AminoAcidGroupType {
  name: string;
  color: string;
}
export const aminoAcidGroups: {[key: string]: AminoAcidGroupType} = {
  Polar: {
    name: "Polar",
    color: "#73e26d"
  },
  Hydrophobic: {
    name: "Hydrophobic",
    color: "#edd672"
  },
  Positive: {
    name: "Charged (+)",
    color: "#0ad9ef"
  },
  Negative: {
    name: "Charged (-)",
    color: "#ff92ce"
  }
};

interface AminoAcidType {
  fullName: string;
  threeLetterAbbreviation: string;
  codons: string[];
  group: AminoAcidGroupType | null;
}
export const aminoAcids: {[key: string]: AminoAcidType} = {
  A: {
    fullName: "Alanine",
    threeLetterAbbreviation: "Ala",
    codons: ["GCT", "GCC", "GCA", "GCG"],
    group: aminoAcidGroups.Hydrophobic
  },
  C: {
    fullName: "Cysteine",
    threeLetterAbbreviation: "Cys",
    codons: ["TGT", "TGC"],
    group: aminoAcidGroups.Polar
  },
  D: {
    fullName: "Aspartic acid",
    threeLetterAbbreviation: "Asp",
    codons: ["GAT", "GAC"],
    group: aminoAcidGroups.Negative
  },
  E: {
    fullName: "Glutamic acid",
    threeLetterAbbreviation: "Glu",
    codons: ["GAA", "GAG"],
    group: aminoAcidGroups.Negative
  },
  F: {
    fullName: "Phenylalanine",
    threeLetterAbbreviation: "Phe",
    codons: ["TTT", "TTC"],
    group: aminoAcidGroups.Hydrophobic
  },
  G: {
    fullName: "Glycine",
    threeLetterAbbreviation: "Gly",
    codons: ["GGT", "GGC", "GGA", "GGG"],
    group: aminoAcidGroups.Hydrophobic
  },
  H: {
    fullName: "Histidine",
    threeLetterAbbreviation: "His",
    codons: ["CAT", "CAC"],
    group: aminoAcidGroups.Polar
  },
  I: {
    fullName: "Isoleucine",
    threeLetterAbbreviation: "Ile",
    codons: ["ATT", "ATC", "ATA"],
    group: aminoAcidGroups.Hydrophobic
  },
  K: {
    fullName: "Lysine",
    threeLetterAbbreviation: "Lys",
    codons: ["AAA", "AAG"],
    group: aminoAcidGroups.Positive
  },
  L: {
    fullName: "Leucine",
    threeLetterAbbreviation: "Leu",
    codons: ["CTT", "CTC", "CTA", "CTG", "TTA", "TTG"],
    group: aminoAcidGroups.Hydrophobic
  },
  M: {
    fullName: "Methionine",
    threeLetterAbbreviation: "Met",
    codons: ["ATG"],
    group: aminoAcidGroups.Hydrophobic
  },
  N: {
    fullName: "Asparagine",
    threeLetterAbbreviation: "Asn",
    codons: ["AAT", "AAC"],
    group: aminoAcidGroups.Polar
  },
  P: {
    fullName: "Proline",
    threeLetterAbbreviation: "Pro",
    codons: ["CCT", "CCC", "CCA", "CCG"],
    group: aminoAcidGroups.Hydrophobic
  },
  Q: {
    fullName: "Glutamine",
    threeLetterAbbreviation: "Gln",
    codons: ["CAA", "CAG"],
    group: aminoAcidGroups.Polar
  },
  R: {
    fullName: "Arginine",
    threeLetterAbbreviation: "Arg",
    codons: ["CGT", "CGC", "CGA", "CGG", "AGA", "AGG"],
    group: aminoAcidGroups.Positive
  },
  S: {
    fullName: "Serine",
    threeLetterAbbreviation: "Ser",
    codons: ["TCT", "TCC", "TCA", "TCG", "AGT", "AGC"],
    group: aminoAcidGroups.Polar
  },
  T: {
    fullName: "Threonine",
    threeLetterAbbreviation: "Thr",
    codons: ["ACT", "ACC", "ACA", "ACG"],
    group: aminoAcidGroups.Polar
  },
  V: {
    fullName: "Valine",
    threeLetterAbbreviation: "Val",
    codons: ["GTT", "GTC", "GTA", "GTG"],
    group: aminoAcidGroups.Hydrophobic
  },
  W: {
    fullName: "Tryptophan",
    threeLetterAbbreviation: "Trp",
    codons: ["TGG"],
    group: aminoAcidGroups.Hydrophobic
  },
  Y: {
    fullName: "Tyrosine",
    threeLetterAbbreviation: "Tyr",
    codons: ["TAT", "TAC"],
    group: aminoAcidGroups.Polar
  },
  0: {
    fullName: "Stop Codon",
    threeLetterAbbreviation: "S",
    codons: ["TAA", "TAG", "TGA"],
    group: null
  }
};

export function getCodonsForAminoAcid(aminoAcid: string) {
  return aminoAcids[aminoAcid].codons;
}

export function expandAminoAcidAbbreviation(singleLetterAbbreviation: string) {
  return aminoAcids[singleLetterAbbreviation].threeLetterAbbreviation;
}

export function getFullNameForAminoAcid(aminoAcid: string) {
  return aminoAcids[aminoAcid].fullName;
}

// Converts a string of single letter amino acids to a string of codons
// The codons are chosen at random from among valid codons
export function convertAminoAcidsToCodons(aminoAcidString: string) {
  return aminoAcidString.split("").reduce((genome, acid) => {
    const codons = getCodonsForAminoAcid(acid);
    return genome += codons[Math.floor(Math.random() * codons.length)];
  }, "");
}

export function getAminoAcidFromCodon(codon: string) {
  for (const [letter, aminoAcid] of Object.entries(aminoAcids)) {
    if (aminoAcid.codons.includes(codon)) {
      return letter;
    }
  }
}

export function getAminoAcidsFromCodons(codons: string[]) {
  return codons.map(getAminoAcidFromCodon).join("");
}

export function getAminoAcidColor(aminoAcid: string | AminoAcidType) {
  const aa = (typeof aminoAcid === "string") ? aminoAcids[aminoAcid] : aminoAcid;
  return aa.group ? aa.group.color : "#000";
}

export function getAminoAcidDescription(aminoAcid: string | AminoAcidType) {
  const aa = (typeof aminoAcid === "string") ? aminoAcids[aminoAcid] : aminoAcid;
  return aa.group ? aa.group.name : "";
}
