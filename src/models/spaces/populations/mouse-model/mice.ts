import { BasicAnimal, Species, Trait, Agent } from "populations.js";
import { MousePopulationsModelType } from "./mouse-populations-model";

const MouseGeneticSpec = {
  name: "Mouse",
  chromosomeNames: ["1", "XY"],
  chromosomeGeneMap: {
    1: ["B"],
    XY: []
  },
  chromosomesLength: {
    1: 100000000,
    2: 100000000,
    XY: 70000000
  },
  geneList: {
    color: {
      alleles: ["B", "b"],
      weights: [.5, .5],
      start: 10000000,
      length: 10584
    }
  },
  alleleLabelMap: {
    "B": "Brown",
    "b": "White",
    "": ""
  },
  traitRules: {
    color: {
      white: [["b", "b"]],
      tan: [["B", "b"]],
      brown: [["B", "B"]]
    }
  }
};

export function getMouseSpecies(model: MousePopulationsModelType) {
  class Mouse extends BasicAnimal {
    public moving: boolean;
    public _closestAgents: any[] | null;

    constructor(args: any) {
      super(args);
      this.label = "Mouse";
      this.moving = false;
    }

    public step() {
      this._closestAgents = null;
      this._setSpeedAppropriateForAge();
      this._depleteEnergy();
      if (this.get("age") > this.species.defs.MATURITY_AGE && Math.random() < this.get("mating chance")) {
        this.mate();
      } else {
        this.wander();
      }
      this._incrementAge();
      return this._checkSurvival();
    }

    public makeNewborn() {
      super.makeNewborn();
      this.set("age", Math.round(Math.random() * 10));
      if (this.organism) {
        this.mutateGenetics();
      }
      // if (this.alleles.color && this.alleles.color !==);

      // FIXME: Would like to call this.environment here, but it is not being set
      // correctly in populations.js
      // const env = (this as any).environment;    // FIXME update populations types
      // const sex = (env.agents.length &&
      //             env.agents[env.agents.length - 1].species.speciesName === "mice" &&
      //             env.agents[env.agents.length - 1].get("sex") === "female")
      //           ? "male" : "female";
      // this.set("sex", sex);
    }

    public mate() {
      const nearest = this._nearestMate();
      if (nearest != null) {
        this.chase(nearest);
        if (nearest.distanceSq < Math.pow(this.get("mating distance"), 2) &&
              ((this.species.defs.CHANCE_OF_MATING == null) || Math.random() < this.species.defs.CHANCE_OF_MATING)) {
          this.reproduce(nearest.agent);
          return this.set("max offspring", 0);
        }
      } else {
        return this.wander(this.get("speed") * Math.random() * 0.75);
      }
    }

    public resetGeneticTraits() {
      super.resetGeneticTraits();       // FIXME populations type def
      return this.set("genome", this._genomeButtonsString());
    }

    public _genomeButtonsString() {
      const alleles = this.organism.getAlleleString().replace(/a:/g, "").replace(/b:/g, "").replace(/,/g, "");
      return alleles;
    }

    // FIXME this should eventually be added to populations.js
    private mutateGenetics() {
      const chromosome = 1;     // for now for simplicity
      const geneNumber = 0;
      const possibleValues: string[] = MouseGeneticSpec.geneList.color.alleles;
      ["a", "b"].forEach( side => {
        if (Math.random() < model.chanceOfMutation) {
          const allele = this.organism.alleles[chromosome][side][geneNumber];
          // For now asume only two possible values
          if (allele === possibleValues[0]) {
            this.organism.genetics.genotype.chromosomes[chromosome][side].alleles[geneNumber] = possibleValues[1];
          } else {
            this.organism.genetics.genotype.chromosomes[chromosome][side].alleles[geneNumber] = possibleValues[0];
          }
        }
      });

      // set the alleles for color (right now this is the entire allele string), and then
      // reset genetic traits to create a brand-new organism with those props.
      // Note: biologica does not take well to modifying an existing organism object, which is
      // why we need to create a new one.
      this.alleles.color = this.organism.getAlleleString();
      this.resetGeneticTraits();
    }
  }

  return new Species({
    speciesName: "mice",
    agentClass: Mouse,
    geneticSpecies: MouseGeneticSpec,
    defs: {
      MAX_HEALTH: 1,
      MATURITY_AGE: 9,
      CHANCE_OF_MUTATION: 0,
      INFO_VIEW_SCALE: 2.5,
      INFO_VIEW_PROPERTIES: {
        "Fur color: ": "color",
        "Genotype: ": "genome",
        "Sex: ": "sex"
      }
    },
    traits: [
          new Trait({ name: "speed", default: 60 }),
          new Trait({ name: "predator",
            default: [
              { name: "hawks" }
            ]
          }),
          new Trait({ name: "color", possibleValues: [],
            isGenetic: true, isNumeric: false }),
          new Trait({ name: "vision distance", default: 200 }),
          new Trait({ name: "mating distance", default: 50 }),
          new Trait({ name: "max offspring", default: 3 }),
          new Trait({ name: "min offspring", default: 2 }),
          new Trait({ name: "metabolism", default: 0 }),
          new Trait({ name: "mating chance", default: 0 })
    ],
    imageRules: [
      {
        name: "mouse",
        contexts: ["environment", "carry-tool"],
        rules: [
          {
            image: {
              path: "curriculum/mouse/populations/sandrat-light.png",
              scale: 0.3,
              anchor: {
                x: 0.8,
                y: 0.47
              }
            },
            useIf(agent: Agent) {
              return agent.get("color") === "white";
            }
          }, {
            image: {
              path: "curriculum/mouse/populations/sandrat-tan.png",
              scale: 0.3,
              anchor: {
                x: 0.8,
                y: 0.47
              }
            },
            useIf(agent: Agent) {
              return agent.get("color") === "tan";
            }
          }, {
            image: {
              path: "curriculum/mouse/populations/sandrat-dark.png",
              scale: 0.3,
              anchor: {
                x: 0.8,
                y: 0.47
              }
            },
            useIf(agent: Agent) {
              return agent.get("color") === "brown";
            }
          }
        ]
      }, {
        name: "sex",
        contexts: ["environment"],
        rules: [
          {
            image: {
              path: "curriculum/mouse/populations/male-stack.png",
              scale: 0.4,
              anchor: {
                x: 0.75,
                y: 0.5
              }
            },
            useIf(agent: Agent) {
              return model.showSexStack && agent.get("sex") === "male";
            }
          }, {
            image: {
              path: "curriculum/mouse/populations/female-stack.png",
              scale: 0.4,
              anchor: {
                x: 0.75,
                y: 0.5
              }
            },
            useIf(agent: Agent) {
              return model.showSexStack && agent.get("sex") === "female";
            }
          }
        ]
      }, {
        name: "mouse info tool",
        contexts: ["info-tool"],
        rules: [
          {
            image: {
              path: "curriculum/mouse/populations/sandrat-light.png",
              scale: 0.4,
              anchor: {
                x: 0.4,
                y: 0.5
              }
            },
            useIf(agent: Agent) {
              return agent.get("color") === "white";
            }
          }, {
            image: {
              path: "curriculum/mouse/populations/sandrat-tan.png",
              scale: 0.4,
              anchor: {
                x: 0.4,
                y: 0.5
              }
            },
            useIf(agent: Agent) {
              return agent.get("color") === "tan";
            }
          }, {
            image: {
              path: "curriculum/mouse/populations/sandrat-dark.png",
              scale: 0.4,
              anchor: {
                x: 0.4,
                y: 0.5
              }
            },
            useIf(agent: Agent) {
              return agent.get("color") === "brown";
            }
          }
        ]
      }
    ]
  });
}
