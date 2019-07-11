// micro version of biologica.js
// this is assuming one-gene, like the current mice

export interface Organism {
  sex: "male" | "female";
  genotype: "RR" | "RC" | "CR" | "CC";
}

export function breed(mother: Organism, father: Organism): Organism {
  const motherAlleles = mother.genotype.split("");
  const fatherAlleles = father.genotype.split("");

  const motherGamete = motherAlleles[Math.round(Math.random())];
  const fatherGamete = fatherAlleles[Math.round(Math.random())];

  const sex = Math.random() < 0.5 ? "female" : "male";
  const genotype = `${motherGamete}${fatherGamete}` as "RR" | "RC" | "CR" | "CC";

  return {
    sex,
    genotype
  };
}
