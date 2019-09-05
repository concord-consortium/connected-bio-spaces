import { Interactive, Environment, Rule, Agent, Events, Species, Rect, Trait,
  ToolButton, helpers } from "populations.js";
import { MousePopulationsModelType, EnvironmentColorType } from "./mouse-populations-model";
import { getMouseSpecies, MouseColors } from "./mice";
import { hawkSpecies } from "./hawks";

let environmentColor: EnvironmentColorType;

function createEnvironment(color: EnvironmentColorType) {
  return new Environment({
    width: 450,
    height: 450,
    viewWidth: 900,
    imgPath: `assets/curriculum/mouse/populations/${color}.png`,
    wrapEastWest: false,
    wrapNorthSouth: false,
    depthPerception : true
  });
}

// all numbers below are floats representing percentages out of 100
interface IInitialColorSpecs {
  white: number;
  tan: number;
}

export class HawksMiceInteractive extends Interactive {
  public setup: () => void;
  public addInitialHawksPopulation: (num: number) => void;
  public removeHawks: () => void;
  public switchEnvironments: (includeNeutralEnvironment: boolean) => void;
  public getData: () => any;
  public removeAgent: (agent: Agent) => void;
  public enterInspectMode: () => void;
  public exitInspectMode: () => void;
}

export function createInteractive(model: MousePopulationsModelType) {
  const mouseSpecies = getMouseSpecies(model);

  environmentColor = model.environment;
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
            return agent.set("chance of being seen", 0.2 - (brownness * 0.2));
          } else if (agent.get("color") === "tan") {
            return agent.set("chance of being seen", 0.08);
          } else {
            return agent.set("chance of being seen", brownness * 0.2);
          }
        }
      }
    }
  ));

  const interactive = new HawksMiceInteractive({
    environment: env,
    speedSlider: false,
    showToolbar: false,
    toolButtons: [
      {
        type: ToolButton.INFO_TOOL
      }
    ]
  });

  const backgroundImages = ["assets/curriculum/mouse/populations/brown.png",
                            "assets/curriculum/mouse/populations/neutral.png",
                            "assets/curriculum/mouse/populations/white.png"];

  helpers.preload([mouseSpecies, {preload: backgroundImages}], () => {
    interactive.setup();
  });

  let addedHawks: boolean;
  let numWhite: number;
  let numTan: number;
  let numBrown: number;
  let numCC: number;
  let numCR: number;
  let numRC: number;
  let numRR: number;
  let numC: number;
  let numR: number;

  function resetVars() {
    addedHawks = false;
    numWhite = 0;
    numTan = 0;
    numBrown = 0;
    numCC = 0;
    numCR = 0;
    numRC = 0;
    numRR = 0;
    numC = 0;
    numR = 0;
  }

  function addInitialMicePopulation(num: number) {
    for (let i = 0; i < num; i++) {
      let colorTrait;

      const whiteCap = Math.round((num / 100) * model["initialPopulation.white"]);
      const tanCap = whiteCap + Math.round((num / 100) * model["initialPopulation.tan"]);
      if (i < whiteCap) {
        colorTrait = createColorTraitByPhenotype("white");
        numWhite++;
      } else if (i < tanCap) {
        colorTrait = createColorTraitByPhenotype("tan");
        numTan++;
      } else {
        colorTrait = createColorTraitByPhenotype("brown");
        numBrown++;
      }

      addAgent(mouseSpecies, [], [
        colorTrait
      ]);
    }
  }

  interactive.setup = () => {
    resetVars();
    addInitialMicePopulation(30);
  };

  Events.addEventListener(Environment.EVENTS.RESET, interactive.setup);

  function addAgent(species: Species, properties: [], traits: Trait[], location?: Rect) {
    const agent = species.createAgent(traits);
    if ((agent as any).setTypeDescription) {
      (agent as any).setTypeDescription();
    }
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

    agent.set("age", Math.round(Math.random() * 20));

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

  function createColorTraitByPhenotype(color: MouseColors) {
    let alleleString;
    switch (color) {
      case "white":
        alleleString = "a:C,b:C";
        break;
      case "tan":
        const rand = Math.random();
        alleleString = rand < 0.5
          ? "a:C,b:R"
          : "a:R,b:C";
        break;
      case "brown":
      default:
        alleleString = "a:R,b:R";
        break;
    }
    return createColorTraitByGenotype(alleleString);
  }

  function addInitialHawksPopulation(num: number) {
    if (addedHawks) return;

    for (let i = 0; i < num; i++) {
      addAgent(hawkSpecies, [], []);
    }
    if (num > 0) {
      addedHawks = true;
    }
  }
  interactive.addInitialHawksPopulation = addInitialHawksPopulation;

  function removeHawks() {
    for (const agent of interactive.environment.agents) {
      if (agent.species === hawkSpecies) {
        agent.die();
      }
    }
    interactive.environment.removeDeadAgents();
    addedHawks = false;
  }
  interactive.removeHawks = removeHawks;

  interactive.switchEnvironments = (includeNeutralEnvironment: boolean) => {
    if (environmentColor === "white") {
      if (includeNeutralEnvironment) {
        environmentColor = "neutral";
      } else {
        environmentColor = "brown";
      }
    } else if (environmentColor === "neutral") {
      environmentColor = "brown";
    } else {
      environmentColor = "white";
    }
    model.setEnvironmentColor(environmentColor);
    interactive.environment.setBackground(`assets/curriculum/mouse/populations/${environmentColor}.png`);
  };

  interactive.getData = () => {
    return {
      numWhite,
      numTan,
      numBrown,
      numCC,
      numCR,
      numRC,
      numRR,
      numC,
      numR
    };
  };

  interactive.removeAgent = (agent: Agent) => {
    interactive.environment.removeAgent(agent);
  };

  interactive.enterInspectMode = () => {
    (interactive.environment as any).setState("info-tool");
  };
  interactive.exitInspectMode = () => {
    (interactive.environment as any).setState("None");
    if ((interactive.environment as any).infoPopup) (interactive.environment as any).infoPopup.hide();
  };

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
      if (agent.species === mouseSpecies && !agent.get("is dead body")) {
        allMice.push(agent);
      }
    }
    const numMice = allMice.length;
    if (numMice < 5) {
      for (let i = 0; i < 4; i++) {
        addAgent(mouseSpecies, [], [copyColorTraitOfRandomMouse(allMice)]);
      }
    }
    numWhite = 0;
    numTan = 0;
    numBrown = 0;
    numCC = 0;
    numCR = 0;
    numRC = 0;
    numRR = 0;
    numC = 0;
    numR = 0;
    allMice.forEach((mouse) => {
      if (mouse.get("color") === "white") {
        numWhite++;
        numCC++;
        numC += 2;
      } else if (mouse.get("color") === "tan") {
        numTan++;
        if (mouse.alleles.color === "a:C,b:R") {
          numCR++;
        } else {
          numRC++;
        }
        numC++;
        numR++;
      } else if (mouse.get("color") === "brown") {
        numBrown++;
        numRR++;
        numR += 2;
      }
    });
    numCC = (numCC / allMice.length) * 100;
    numCR = (numCR / allMice.length) * 100;
    numRC = (numRC / allMice.length) * 100;
    numRR = (numRR / allMice.length) * 100;

    const totalAlleles = numC + numR;
    numC = (numC / totalAlleles) * 100;
    numR = (numR / totalAlleles) * 100;

    // If there are no specific selective pressures (ie there are no hawks, or the hawks eat
    // everything with equal probability), the population should be 'stabilized', so that no
    // color of mouse dies out completely
    if ((!addedHawks || environmentColor === "neutral")) {
      // Make sure there are *some* white mice to ensure white mice are possible
      if (numWhite > 0 && numWhite < 10) {
        for (let i = 0; i < 3; i++) {
          addAgent(mouseSpecies, [], [createColorTraitByGenotype("a:C,b:C")]);
        }
      }

      if (numBrown > 0 && numBrown < 10) {
        for (let i = 0; i < 3; i++) {
          addAgent(mouseSpecies, [], [createColorTraitByGenotype("a:R,b:R")]);
        }
      }
    }

    // Insurance: Ensure there are always at least two rabbits of the correct color.
    // We need to catch it before there are zero. Once there are zero, we can't create any out
    // of thin air. (E.g. user eliminated one population then changed environment)
    if (environmentColor === "white" && numWhite > 1 && numWhite < 3) {
      for (let i = 0; i < 2; i++) {
        addAgent(mouseSpecies, [], [createColorTraitByGenotype("a:C,b:C")]);
      }
    } else if (environmentColor === "neutral" && numTan > 1 && numTan < 3) {
      for (let i = 0; i < 2; i++) {
        addAgent(mouseSpecies, [], [createColorTraitByGenotype("a:C,b:R")]);
      }
    } else if (environmentColor === "brown" && numBrown > 1 && numBrown < 3) {
      for (let i = 0; i < 2; i++) {
        addAgent(mouseSpecies, [], [createColorTraitByGenotype("a:R,b:R")]);
      }
    }

    // Reproduction rates go to zero when the population reaches a 'carrying capacity' of 50
    setProperty(allMice, "mating chance", -.005 * numMice + .25);

    // If there is only one color left, and it is the "wrong" color, reduce carrying capacity
    if (addedHawks && (numBrown === numMice || numWhite === numMice)) {
      allMice.forEach((mouse) => {
        if (mouse.get("color") !== environmentColor) {
          // Reduce the carrying capacity to 10 if mice are vulnerable to a predator
          mouse.set("mating chance", -.025 * numMice + .25);
        }
      });
    }
  });
  return interactive;
}
