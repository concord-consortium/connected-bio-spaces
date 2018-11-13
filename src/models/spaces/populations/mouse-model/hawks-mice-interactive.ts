import { Interactive, Environment, ToolButton, Rule, Agent, Events, Species, Rect, Trait } from "populations.js";
import { MousePopulationsModelType } from "./mouse-populations-model";
import { getMouseSpecies } from "./mice";
import { hawkSpecies } from "./hawks";

export type EnvironmentColor = "white" | "brown" | "neutral";
let environmentColor: EnvironmentColor;

function createEnvironment(color: EnvironmentColor) {
  return new Environment({
    columns: 45,
    rows: 45,
    imgPath: `curriculum/mouse/populations/${color}.png`,
    wrapEastWest: false,
    wrapNorthSouth: false
  });
}

export function createInteractive(model: MousePopulationsModelType) {
  const mouseSpecies = getMouseSpecies(model);
  environmentColor = model.environmentColor;
  const env = createEnvironment(environmentColor);

  env.addRule(new Rule({
    action: (agent: Agent) => {
        let brownness;
        if (agent.species === mouseSpecies) {
          brownness = environmentColor === "white"
            ? brownness = 0
            : environmentColor === "neutral"
              ? brownness = .5
              : brownness = 1;
          if (agent.get("color") === "brown") {
            return agent.set("chance of being seen", 0.6 - (brownness * 0.6));
          } else {
            return agent.set("chance of being seen", brownness * 0.6);
          }
        }
      }
    }
  ));

  const interactive = new Interactive({
    environment: env,
    speedSlider: false,
    addOrganismButtons: [
      {
        species: mouseSpecies,
        imagePath: "curriculum/mouse/populations/sandrat-light.png",
        traits: [],
        limit: 100,
        scatter: 4
      },
      {
        species: hawkSpecies,
        imagePath: "curriculum/mouse/populations/hawk.png",
        traits: [],
        limit: model.numHawks,
        scatter: model.numHawks
      }
    ],
    toolButtons: [
      {
        type: ToolButton.INFO_TOOL
      }, {
        type: ToolButton.CARRY_TOOL
      }
    ]
  });

  let addedMice: boolean;
  let addedHawks: boolean;

  function resetVars() {
    addedMice = false;
    addedHawks = false;
  }
  resetVars();

  Events.addEventListener(Environment.EVENTS.RESET, resetVars);

  function addAgent(species: Species, properties: [], traits: Trait[], location?: Rect) {
    const agent = species.createAgent(traits);
    let coords;
    if (location) {
      coords = env.randomLocationWithin(location.x, location.y, location.width, location.height, true);
    } else {
      coords = env.randomLocation();
    }
    agent.setLocation(coords);
    for (const prop of properties) {
      agent.set(prop[0], prop[1]);
    }
    env.addAgent(agent);
  }

  function copyColorTraitOfRandomMouse(allMice: Agent[]) {
    const randomMouse = allMice[Math.floor(Math.random() * allMice.length)];
    const alleleString = randomMouse.organism.alleles;
    return new Trait({
      name: "color",
      default: alleleString,
      isGenetic: true
    });
  }

  function createColorTraitByGenotype(alleleString: string) {
    return new Trait({
      name: "color",
      default: alleleString,
      isGenetic: true
    });
  }

  function createColorTraitByPhenotype(color: "white" | "brown") {
    let alleleString;
    switch (color) {
      case "white":
        alleleString = "a:b,b:b";
        break;
      case "brown":
      default:
        const rand = Math.random();
        alleleString = rand < (1 / 3)
          ? "a:b,b:B"
          : rand < (2 / 3)
            ? "a:B,b:b"
            : "a:B,b:B";
    }
    return createColorTraitByGenotype(alleleString);
  }

  // all numbers below are floats representing percentages
  interface IInitialColorSpecs {
    white: number;
    brown: number;
  }
  interface IInitialGentotypeSpecs {
    bb: number;
    Bb: number;
    BB: number;
  }
  function addInitialMicePopulation(num: number, byColor: true,
                                    initialSpecs: IInitialColorSpecs | IInitialGentotypeSpecs) {
    for (let i = 0; i < num; i++) {
      let colorTrait;
      if (byColor && "white" in initialSpecs) {
        const whiteCap = Math.round(num * initialSpecs.white);
        if (i < whiteCap) {
          colorTrait = createColorTraitByPhenotype("white");
        } else {
          colorTrait = createColorTraitByPhenotype("brown");
        }
      } else if (!byColor && "bb" in initialSpecs) {
        const bbCap = Math.round(num * initialSpecs.bb);
        const bBCap = bbCap + Math.round(num * initialSpecs.Bb);
        if (i < bbCap) {
          colorTrait = createColorTraitByGenotype("a:b,b:b");
        } else if (i < bBCap) {
          const alleleString = Math.random() < 0.5
            ? "a:b,b:B"
            : "a:B,b:b";
          colorTrait = createColorTraitByGenotype(alleleString);
        } else {
          colorTrait = createColorTraitByGenotype("a:B,b:B");
        }
      }
      if (colorTrait) {
        addAgent(mouseSpecies, [], [
          colorTrait
        ]);
      }
    }
  }
  (window as any).addInitialMicePopulation = addInitialMicePopulation;

  function setProperty(agents: Agent[], prop: string, val: any) {
    const results = [];
    for (const agent of agents) {
      results.push(agent.set(prop, val));
    }
    return results;
  }

  Events.addEventListener(Environment.EVENTS.STEP, () => {
    const allMice: Agent[] = [];
    for (const agent of env.agents) {
      if (agent.species === mouseSpecies) {
        allMice.push(agent);
      } else {
        addedHawks = true;
      }
    }
    const numMice = allMice.length;
    if (!addedMice && numMice > 0) {
      addedMice = true;
    }
    if (addedMice && numMice < 5) {
      for (let i = 0; i < 4; i++) {
        addAgent(mouseSpecies, [], [copyColorTraitOfRandomMouse(allMice)]);
      }
    }

    // If there are no specific selective pressures (ie there are no hawks, or the hawks eat
    // everything with equal probability), the population should be 'stabilized', so that no
    // color of mouse dies out completely
    if (addedMice && (!addedHawks || environmentColor === "neutral")) {
      let numWhite = 0;
      allMice.forEach((mouse) => {
        if (mouse.get("color") === "white") {
          numWhite++;
        }
      });

      // Make sure there are *some* white mice to ensure white mice are possible
      if (numWhite > 0 && numWhite < 10) {
        for (let i = 0; i < 3; i++) {
          addAgent(mouseSpecies, [], [createColorTraitByGenotype("a:b,b:b")]);
        }
      }

      const numBrown = allMice.length - numWhite;
      if (numBrown > 0 && numBrown < 10) {
        for (let i = 0; i < 3; i++) {
          addAgent(mouseSpecies, [], [createColorTraitByGenotype("a:B,b:B")]);
        }
      }
    }

    // Reproduction rates go to zero when the population reaches a 'carrying capacity' of 50
    setProperty(allMice, "mating chance", -.005 * numMice + .25);

    if (this.addedMice && addedHawks) {
      allMice.forEach((mouse) => {
        if (mouse.get("color") !== environmentColor) {
          // Reduce the carrying capacity to 10 if mice are vulnerable to a predator
          mouse.set("mating chance", -.025 * this.numMice + .25);
        }
      });
    }
  });
  return interactive;
}
