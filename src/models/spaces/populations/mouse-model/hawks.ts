import { BasicAnimal, Species, Trait, Agent } from "populations.js";

class Hawk extends BasicAnimal {

  constructor(args: any) {
    super(args);
    this.label = "Hawk";
    this._viewLayer = 3;
  }

  public isInteractive() {      // FIXME: Would be nice to set this better in populations
    return false;
  }
}

export const hawkSpecies = new Species({
  speciesName: "hawks",
  agentClass: Hawk,
  defs: {
    CHANCE_OF_MUTATION: 0,
    INFO_VIEW_SCALE: 1
  },
  traits: [
    new Trait({name: "speed", default: 80 }),
    new Trait({
      name: "prey",
      default: [
        {
          name: "mice"
        }
      ]
    }),
    new Trait({ name: "vision distance", default: 150 }),
    new Trait({ name: "eating distance", default: 50 }),
    new Trait({ name: "mating distance", default: 50 }),
    new Trait({ name: "max offspring", default: 3 }),
    new Trait({ name: "resource consumption rate", default: 10 }),
    new Trait({ name: "metabolism", default: 0.5 }),
    new Trait({ name: "wings", default: 0 }),
    new Trait({ name: "mating desire bonus", default: -40 }),
    new Trait({ name: "hunger bonus", default: 100 }),
    new Trait({ name: "is immortal", default: true })
  ],
  imageRules: [{
    name: "hawk",
    contexts: ["environment"],
    rules: [{
      image: {
        path: "assets/curriculum/mouse/populations/hawk.png",
        scale: 0.3,
        anchor: {
          x: 0.5,
          y: 0.2
        }
      }
    }]
  }]
});
