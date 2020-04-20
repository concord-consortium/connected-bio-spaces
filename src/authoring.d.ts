/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Unit = Mouse;
export type Mouse = "mouse";
export type ShowTopBar = boolean;
export type ShowPopulationsSpace = boolean;
export type ShowBreedingSpace = boolean;
export type ShowOrganismSpace = boolean;
export type ShowDNAProteinSpace = boolean;
export type InitialDisplayedSpace = "none" | "populations" | "breeding" | "organism" | "dna";
export type Sex = "female" | "male";
export type Genotype = "RR" | "RC" | "CR" | "CC";
export type InstructionsAsMarkdown = string;
export type InitialEnvironment = "white" | "neutral" | "brown";
export type EnableChangeEnvironmentsButton = boolean;
export type IncludeMixedEnvironment = boolean;
export type ShowGenotypeInInspectView = boolean;
export type White = number;
export type Tan = number;
export type NumberOfHawks = number;
export type EnableStudentMutationControl = boolean;
export type BreedWithMutations = boolean;
export type ChanceOfMutations = number;
export type EnableStudentInheritanceControl = boolean;
export type BreedWithInheritance = boolean;
export type White1 = number;
export type Tan1 = number;
export type ProbabilityOfShowingBody = number;
export type TimeToShowBodySteps = number;
export type EnableColorChart = boolean;
export type EnableGenotypeChart = boolean;
export type EnableAllelesChart = boolean;
export type InstructionsAsMarkdown1 = string;
export type ShowMysteryLocationLabels = boolean;
export type ShowMysterySubstanceLabels = boolean;
export type AllowZoomingToReceptor = boolean;
export type AllowZoomingToNucleus = boolean;
export type InstructionsAsMarkdown2 = string;
export type EnableInspectGametesButton = boolean;
export type EnableMouseFurColorPieChart = boolean;
export type EnableMouseGenotypesPieChart = boolean;
export type EnableMouseSexPieChart = boolean;

export interface ConnectedBioAuthoring {
  curriculum?: Unit;
  topBar?: ShowTopBar;
  ui?: InvestigationSpaces;
  backpack?: InitialBackpack;
  populations?: PopulationsModel;
  organisms?: OrganismModel;
  breeding?: BreedingModel;
  [k: string]: any;
}
export interface InvestigationSpaces {
  showPopulationSpace?: ShowPopulationsSpace;
  showBreedingSpace?: ShowBreedingSpace;
  showOrganismSpace?: ShowOrganismSpace;
  showDNASpace?: ShowDNAProteinSpace;
  investigationPanelSpace?: InitialDisplayedSpace;
  [k: string]: any;
}
export interface InitialBackpack {
  collectedMice?: {
    sex?: Sex;
    genotype?: Genotype;
    [k: string]: any;
  }[];
  [k: string]: any;
}
export interface PopulationsModel {
  instructions?: InstructionsAsMarkdown;
  environment?: InitialEnvironment;
  showSwitchEnvironmentsButton?: EnableChangeEnvironmentsButton;
  includeNeutralEnvironment?: IncludeMixedEnvironment;
  showInspectGenotype?: ShowGenotypeInInspectView;
  initialPopulation?: InitialMousePopulation;
  numHawks?: NumberOfHawks;
  inheritance?: Inheritance;
  deadMice?: DeadMice;
  enableColorChart?: EnableColorChart;
  enableGenotypeChart?: EnableGenotypeChart;
  enableAllelesChart?: EnableAllelesChart;
  [k: string]: any;
}
export interface InitialMousePopulation {
  white?: White;
  tan?: Tan;
  [k: string]: any;
}
export interface Inheritance {
  showStudentControlOfMutations?: EnableStudentMutationControl;
  breedWithMutations?: BreedWithMutations;
  chanceOfMutations?: ChanceOfMutations;
  showStudentControlOfInheritance?: EnableStudentInheritanceControl;
  breedWithInheritance?: BreedWithInheritance;
  randomOffspring?: ProportionsOfRandomOffspringWhenBreedingWithoutInheritance;
  [k: string]: any;
}
export interface ProportionsOfRandomOffspringWhenBreedingWithoutInheritance {
  white?: White1;
  tan?: Tan1;
  [k: string]: any;
}
export interface DeadMice {
  chanceOfShowingBody?: ProbabilityOfShowingBody;
  timeToShowBody?: TimeToShowBodySteps;
  [k: string]: any;
}
export interface OrganismModel {
  instructions?: InstructionsAsMarkdown1;
  useMysteryOrganelles?: ShowMysteryLocationLabels;
  useMysterySubstances?: ShowMysterySubstanceLabels;
  showZoomToReceptor?: AllowZoomingToReceptor;
  showZoomToNucleus?: AllowZoomingToNucleus;
  [k: string]: any;
}
export interface BreedingModel {
  instructions?: InstructionsAsMarkdown2;
  enableInspectGametes?: EnableInspectGametesButton;
  enableColorChart?: EnableMouseFurColorPieChart;
  enableGenotypeChart?: EnableMouseGenotypesPieChart;
  enableSexChart?: EnableMouseSexPieChart;
  [k: string]: any;
}
