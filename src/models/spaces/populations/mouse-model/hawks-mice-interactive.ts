import { Interactive, Environment, Rule, Agent, Events, Species, Rect, Trait, ToolButton } from "populations.js";
import { MousePopulationsModelType, EnvironmentColorType } from "./mouse-populations-model";
import { getMouseSpecies, MouseColors } from "./mice";
import { hawkSpecies } from "./hawks";

let environmentColor: EnvironmentColorType;

function createEnvironment(color: EnvironmentColorType) {
  return new Environment({
    columns: 45,
    rows: 45,
    imgPath: `assets/curriculum/mouse/populations/${color}.png`,
    wrapEastWest: false,
    wrapNorthSouth: false
  });
}

// all numbers below are floats representing percentages out of 100
interface IInitialColorSpecs {
  white: number;
  tan: number;
}

export class HawksMiceInteractive extends Interactive {
  public addInitialHawksPopulation: (num: number) => void;
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
            return agent.set("chance of being seen", 0.6 - (brownness * 0.6));
          } else if (agent.get("color") === "tan") {
            return agent.set("chance of being seen", 0.3);
          } else {
            return agent.set("chance of being seen", brownness * 0.6);
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

  let addedHawks: boolean;
  let numWhite: number;
  let numTan: number;
  let numBrown: number;

  function resetVars() {
    addedHawks = false;
    numWhite = 0;
    numTan = 0;
    numBrown = 0;
  }

  function addInitialMicePopulation(num: number) {
    for (let i = 0; i < num; i++) {
      let colorTrait;

      const whiteCap = Math.round((num / 100) * model["initialPopulation.white"]);
      const tanCap = whiteCap + Math.round((num / 100) * model["initialPopulation.tan"]);
      if (i < whiteCap) {
        colorTrait = createColorTraitByPhenotype("white");
      } else if (i < tanCap) {
        colorTrait = createColorTraitByPhenotype("tan");
      } else {
        colorTrait = createColorTraitByPhenotype("brown");
      }

      addAgent(mouseSpecies, [], [
        colorTrait
      ]);
    }
  }

  function setup() {
    resetVars();
    addInitialMicePopulation(30);
  }

  setup();
  Events.addEventListener(Environment.EVENTS.RESET, setup);

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

  function createColorTraitByPhenotype(color: MouseColors) {
    let alleleString;
    switch (color) {
      case "white":
        alleleString = "a:b,b:b";
        break;
      case "tan":
        const rand = Math.random();
        alleleString = rand < 0.5
          ? "a:b,b:B"
          : "a:B,b:b";
        break;
      case "brown":
      default:
        alleleString = "a:B,b:B";
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
    interactive.environment.setBackground(`assets/curriculum/mouse/populations/${environmentColor}.png`);

  };

  interactive.getData = () => {
    return {
      numWhite,
      numTan,
      numBrown
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
    (interactive.environment as any).infoPopup.hide();
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
      if (agent.species === mouseSpecies) {
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
    allMice.forEach((mouse) => {
      if (mouse.get("color") === "white") {
        numWhite++;
      } else if (mouse.get("color") === "tan") {
        numTan++;
      } else if (mouse.get("color") === "brown") {
        numBrown++;
      }
    });

    // If there are no specific selective pressures (ie there are no hawks, or the hawks eat
    // everything with equal probability), the population should be 'stabilized', so that no
    // color of mouse dies out completely
    if ((!addedHawks || environmentColor === "neutral")) {
      // Make sure there are *some* white mice to ensure white mice are possible
      if (numWhite > 0 && numWhite < 10) {
        for (let i = 0; i < 3; i++) {
          addAgent(mouseSpecies, [], [createColorTraitByGenotype("a:b,b:b")]);
        }
      }

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
