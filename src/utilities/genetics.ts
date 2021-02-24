// micro version of biologica.js
// this is assuming one-gene, like the current mice

import { Unit } from "../authoring";
import { speciesDef, UnitSpecies } from "../models/units";

export interface Organism {
  species: Unit;
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

export function fertilize(motherGamete: Gamete, fatherGamete: Gamete, speciesName: Unit): Organism {
  const genotype = `${motherGamete.allele}${fatherGamete.allele}`;
  const sex = fatherGamete.sexChromosome === "X" ? "female" : "male";

  return {
    species: speciesName,
    sex,
    genotype
  };
}

export function breed(mother: Organism, father: Organism, chanceOfMutations: number, speciesName: Unit): Organism {
  const species = speciesDef(speciesName);
  const motherGamete = createGamete(mother, chanceOfMutations, species);
  const fatherGamete = createGamete(father, chanceOfMutations, species);

  return fertilize(motherGamete, fatherGamete, speciesName);
}
