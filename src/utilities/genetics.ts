// micro version of biologica.js
// this is assuming one-gene, like the current mice

import { UnitSpecies } from "../models/units";

export interface Organism {
  sex: "male" | "female";
  genotype: string;
}

export interface Gamete {
  allele: string;
  sexChromosome: "X" | "Y";
}

/**
 * Assumes genotype consists of a single gene, and so is specified as a string of length 2
 */
export function createGamete(org: Organism, chanceOfMutations: number, species: UnitSpecies): Gamete {
  const alleles = org.genotype.split("");
  const orgAllele = alleles[Math.round(Math.random())];
  let allele;
  if (Math.random() < chanceOfMutations) {
    const otherAlleles = species.alleles.filter(a => a !== orgAllele);
    allele = otherAlleles[Math.floor(Math.random() * otherAlleles.length)];
  } else {
    allele = orgAllele;
  }
  const sexChromosome = org.sex === "female"
    ? "X"
    : Math.random() < 0.5 ? "X" : "Y";
  return {
    allele,
    sexChromosome
  };
}

export function fertilize(motherGamete: Gamete, fatherGamete: Gamete): Organism {
  const genotype = `${motherGamete.allele}${fatherGamete.allele}`;
  const sex = fatherGamete.sexChromosome === "X" ? "female" : "male";

  return {
    sex,
    genotype
  };
}

export function breed(mother: Organism, father: Organism, chanceOfMutations: number, species: UnitSpecies): Organism {
  const motherGamete = createGamete(mother, chanceOfMutations, species);
  const fatherGamete = createGamete(father, chanceOfMutations, species);

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
