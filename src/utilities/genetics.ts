// micro version of biologica.js
// this is assuming one-gene, like the current mice

export interface Organism {
  sex: "male" | "female";
  genotype: "RR" | "RC" | "CR" | "CC";
}

export interface Gamete {
  allele: "R" | "C";
  sexChromosome: "X" | "Y";
}

export function createGamete(org: Organism): Gamete {
  const alleles = org.genotype.split("");
  const allele = alleles[Math.round(Math.random())] as "R" | "C";
  const sexChromosome = org.sex === "female"
    ? "X"
    : Math.random() < 0.5 ? "X" : "Y";
  return {
    allele,
    sexChromosome
  };
}

export function fertilize(motherGamete: Gamete, fatherGamete: Gamete): Organism {
  const genotype = `${motherGamete.allele}${fatherGamete.allele}` as "RR" | "RC" | "CR" | "CC";
  const sex = fatherGamete.sexChromosome === "X" ? "female" : "male";

  return {
    sex,
    genotype
  };
}

export function breed(mother: Organism, father: Organism): Organism {
  const motherGamete = createGamete(mother);
  const fatherGamete = createGamete(father);

  return fertilize(motherGamete, fatherGamete);
}

export function genotypeHTMLLabel(genotype: string): string {
  switch (genotype) {
    case "CC":
      return "R<sup>L</sup>R<sup>L</sup>";
    case "RR":
      return "R<sup>D</sup>R<sup>D</sup>";
    case "RC":
      return "R<sup>D</sup>R<sup>L</sup>";
    case "CR":
      return "R<sup>L</sup>R<sup>D</sup>";
    default:
      return "";
  }
}

export function gameteHTMLLabel(gamete: string): string {
  switch (gamete) {
    case "C":
      return "R<sup>L</sup>";
    case "R":
      return "R<sup>D</sup>";
    default:
      return "";
  }
}
