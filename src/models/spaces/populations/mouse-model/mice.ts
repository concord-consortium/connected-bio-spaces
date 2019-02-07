import { BasicAnimal, Species, Trait, Agent } from "populations.js";
import { MousePopulationsModelType } from "./mouse-populations-model";

const MouseGeneticSpec = {
  name: "Mouse",
  chromosomeNames: ["1", "XY"],
  chromosomeGeneMap: {
    1: ["R"],
    XY: []
  },
  chromosomesLength: {
    1: 100000000,
    2: 100000000,
    XY: 70000000
  },
  geneList: {
    color: {
      alleles: ["R", "C"],
      weights: [.5, .5],
      start: 10000000,
      length: 10584
    }
  },
  alleleLabelMap: {
    "R": "Brown",
    "C": "White",
    "": ""
  },
  traitRules: {
    color: {
      white: [["C", "C"]],
      tan: [["R", "C"]],
      brown: [["R", "R"]]
    }
  }
};

export type MouseColors = "white" | "tan" | "brown";

export function getMouseSpecies(model: MousePopulationsModelType) {
  class Mouse extends BasicAnimal {
    public _closestAgents: any[] | null;

    constructor(args: any) {
      super(args);
      this.label = "Mouse";
    }

    public getMovement() {
      return "walk";
    }

    public step() {
      this._closestAgents = null;
      this._setSpeedAppropriateForAge();
      this._depleteEnergy();
      if (this.get("age") > this.species.defs.MATURITY_AGE && Math.random() < this.get("mating chance")) {
        this.mate();
      } else {
        this.wander(null);
      }
      this._incrementAge();
      return this._checkSurvival();
    }

    public wander(speed: any){
      if (speed == null) {
        const defaultSpeed = this.get("default speed");
        speed = this.get("speed");
        speed += (Math.random() * 2 - 1) * .1;
        speed = Math.min(Math.max(speed, defaultSpeed * .75), defaultSpeed * 1.25);
        this.set("speed", speed);
      }
      const change = (Math.random() * 1 - .5) / 10;
      let newDir = this.get("direction") + change;
      const newAngle = (newDir * (180 / Math.PI) % 360);
      if ((newAngle > 30 && newAngle < 150) || (newAngle > 210 && newAngle < 330)) {
        newDir = this.get("direction") - change;
      }

      if (Math.random() < .03) {
        newDir = Math.cos(newDir) > 0 ? newDir + Math.PI : newDir - Math.PI;
      }
      this.set("direction", newDir);
      return this.move(speed);
    }

    // note, populations.js is a little confusing here (FIXME...). makeNewborn is called twice, once before
    // the organism object is created, and once after.
    public makeNewborn() {
      super.makeNewborn();
      let newDir = this.get("direction");
      const newAngle = (newDir * (180 / Math.PI) % 360);
      if (newAngle > 30 && newAngle <= 90) {
        newDir = (Math.PI / 6);
      } else if (newAngle < 150 && newAngle > 90) {
        newDir = (Math.PI * 5 / 6);
      } else if (newAngle > 210 && newAngle <= 270) {
        newDir = (Math.PI * 7 / 6);
      } else if (newAngle > 270 && newAngle < 330) {
        newDir = (Math.PI * 11 / 6);
      }
      this.set("direction", newDir);

      this.set("age", Math.round(Math.random() * 10));

      if (this.organism) {
        if (model["inheritance.breedWithInheritance"]) {
          this.mutateGenetics();
        } else {
          this.setRandomColorGenetics();
        }

        this.setTypeDescription();
      }
    }

    public setTypeDescription() {
      const color = this.get("color");
      const type = color === "white" ? "light brown" :
        color === "tan" ? "medium brown" : "dark brown";
      this.set("type", type);
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
        return this.wander(this.get("default speed") * 0.75);
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

    private setRandomColorGenetics() {
      const whiteChance = model["inheritance.randomOffspring.white"] / 100;
      const tanChance = whiteChance + model["inheritance.randomOffspring.tan"] / 100;
      const rand = Math.random();
      if (rand < whiteChance) {
        this.alleles.color = "a:C,b:C";
      } else if (rand < tanChance) {
        this.alleles.color = Math.random() < 0.5 ? "a:R,b:C" : "a:C,b:R";
      } else {
        this.alleles.color = "a:R,b:R";
      }
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
      INFO_VIEW_SCALE: 2,
      INFO_VIEW_PROPERTIES: {
        "Type:": "type",
        "Sex:": "sex"
      }
    },
    traits: [
          new Trait({ name: "default speed", default: 6 }),
          new Trait({ name: "speed", default: 6 }),
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
    imageProperties: {
      initialFlipDirection: "right"
    },
    imageRules: [
      {
        name: "mouse",
        contexts: ["environment", "carry-tool"],
        rules: [
          {
            image: {
              animations: [
                {
                  path: "assets/curriculum/mouse/populations/sandrat-light-sprite.json",
                  movement: "stop",
                  animationName: "stop-light",
                  length: 1,
                  loop: true,
                  frameRate: 10
                },
                {
                  path: "assets/curriculum/mouse/populations/sandrat-light-sprite.json",
                  movement: "walk",
                  animationName: "walk-light",
                  length: 5,
                  loop: true,
                  frameRate: 25
                }
              ],
              scale: 0.16,
              anchor: {
                x: 0.7,
                y: 0.5
              }
            },
            useIf(agent: Agent) {
              return agent.get("color") === "white";
            }
          }, {
            image: {
              animations: [
                {
                  path: "assets/curriculum/mouse/populations/sandrat-tan-sprite.json",
                  movement: "stop",
                  animationName: "stop-tan",
                  length: 1,
                  loop: true,
                  frameRate: 10
                },
                {
                  path: "assets/curriculum/mouse/populations/sandrat-tan-sprite.json",
                  movement: "walk",
                  animationName: "walk-tan",
                  length: 5,
                  loop: true,
                  frameRate: 25
                }
              ],
              scale: 0.16,
              anchor: {
                x: 0.7,
                y: 0.5
              }
            },
            useIf(agent: Agent) {
              return agent.get("color") === "tan";
            }
          }, {
            image: {
              animations: [
                {
                  path: "assets/curriculum/mouse/populations/sandrat-dark-sprite.json",
                  movement: "stop",
                  animationName: "stop-dark",
                  length: 1,
                  loop: true,
                  frameRate: 10
                },
                {
                  path: "assets/curriculum/mouse/populations/sandrat-dark-sprite.json",
                  movement: "walk",
                  animationName: "walk-dark",
                  length: 5,
                  loop: true,
                  frameRate: 25
                }
              ],
              scale: 0.16,
              anchor: {
                x: 0.7,
                y: 0.5
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
              path: "assets/curriculum/mouse/populations/male-stack.png",
              scale: 0.3,
              anchor: {
                x: 0.5,
                y: 0.5
              }
            },
            useIf(agent: Agent) {
              return model.showSexStack && agent.get("sex") === "male";
            }
          }, {
            image: {
              path: "assets/curriculum/mouse/populations/female-stack.png",
              scale: 0.3,
              anchor: {
                x: 0.5,
                y: 0.5
              }
            },
            useIf(agent: Agent) {
              return model.showSexStack && agent.get("sex") === "female";
            }
          }
        ]
      }, {
        name: "heterozygous",
        contexts: ["environment"],
        rules: [
          {
            image: {
              path: "assets/curriculum/mouse/populations/heterozygous-stack.png",
              scale: 0.3,
              anchor: {
                x: 0.5,
                y: 0.5
              }
            },
            useIf(agent: Agent) {
              return model.showHeteroStack && agent.get("color") === "tan";
            }
          }
        ]
      }, {
        name: "mouse info tool",
        contexts: ["info-tool"],
        rules: [
          {
            image: {
              path: "assets/curriculum/mouse/populations/sandrat-light.png",
              scale: 0.16,
              anchor: {
                x: 0.5,
                y: 0.5
              }
            },
            useIf(agent: Agent) {
              return agent.get("color") === "white";
            }
          }, {
            image: {
              path: "assets/curriculum/mouse/populations/sandrat-tan.png",
              scale: 0.16,
              anchor: {
                x: 0.5,
                y: 0.5
              }
            },
            useIf(agent: Agent) {
              return agent.get("color") === "tan";
            }
          }, {
            image: {
              path: "assets/curriculum/mouse/populations/sandrat-dark.png",
              scale: 0.16,
              anchor: {
                x: 0.5,
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
