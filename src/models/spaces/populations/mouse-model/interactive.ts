import { Interactive, Environment, ToolButton, Rule, Agent, Events, Species, Rect, Trait } from "populations.js";
import { MousePopulationsModelType } from "./mouse-populations-model";
import { getMouseSpecies } from "./organisms";

const lightEnvironment = new Environment({
  columns: 45,
  rows: 45,
  imgPath: "curriculum/mouse/populations/white.png",
  wrapEastWest: false,
  wrapNorthSouth: false
});

export function createInteractive(model: MousePopulationsModelType) {
  const mouseSpecies = getMouseSpecies(model);
  const env = lightEnvironment;

  env.addRule(new Rule({
    action: (agent: Agent) => {
        let brownness;
        if (agent.species === mouseSpecies) {
          const envColor = "white";         // FIXME
          brownness = envColor === "white"
            ? brownness = 0
            : envColor === "neutral"
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
    environment: lightEnvironment,
    speedSlider: false,
    addOrganismButtons: [
      {
        species: mouseSpecies,
        imagePath: "curriculum/mouse/populations/sandrat-light.png",
        traits: [],
        limit: 100,
        scatter: ((100 as unknown) as boolean)        // FIXME: type def is wrong
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

  let addedMice = false;

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

  function copyRandomColorTrait(allMice: Agent[]) {
    const randomMouse = allMice[Math.floor(Math.random() * allMice.length)];
    const alleleString = (randomMouse as any).organism.alleles;        // FIXME: Add to populations type def
    return new Trait({
      name: "color",
      default: alleleString,
      isGenetic: true
    });
  }

  function createRandomColorTraitByPhenotype(percentBrown: number) {
    let alleleString = "";
    if (Math.random() < percentBrown) {
      const rand = Math.random();
      if (rand < 1 / 3) {
        alleleString = "a:B,b:b";
      } else if (rand < 2 / 3) {
        alleleString = "a:b,b:B";
      } else {
        alleleString = "a:B,b:B";
      }
    } else {
      alleleString = "a:b,b:b";
    }
    return new Trait({
      name: "color",
      default: alleleString,
      isGenetic: true
    });
  }

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
    if (!addedMice && numMice > 0) {
      addedMice = true;
    }
    if (addedMice && numMice < 5) {
      for (let i = 0; i < 4; i++) {
        addAgent(mouseSpecies, [], [copyRandomColorTrait(allMice)]);
      }
    }

    // If there are no specific selective pressures (ie there are no hawks, or the hawks eat
    // everything with equal probability), the population should be 'stabilized', so that no
    // color of mouse dies out completely
    if (addedMice) { // && (!this.addedHawks || this.envColors[location.index] === 'neutral')) {
      let numWhite = 0;
      allMice.forEach((mouse) => {
        if (mouse.get("color") === "white") {
          numWhite++;
        }
      });

      // Make sure there are *some* white mice to ensure white mice are possible
      if (numWhite > 0 && numWhite < 10) {
        for (let i = 0; i < 3; i++) {
          addAgent(mouseSpecies, [], [createRandomColorTraitByPhenotype(0)]);
        }
      }

      const numBrown = allMice.length - numWhite;
      if (numBrown > 0 && numBrown < 10) {
        for (let i = 0; i < 3; i++) {
          addAgent(mouseSpecies, [], [createRandomColorTraitByPhenotype(1)]);
        }
      }
    }

    // Reproduction rates go to zero when the population reaches a 'carrying capacity' of 50
    setProperty(allMice, "mating chance", -.005 * numMice + .25);

    // if (this.addedMice && this.addedHawks) {
    //   allMice.forEach((mouse) => {
    //     if (mouse.get("color") !== this.envColors[location.index]) {
    //       // Reduce the carrying capacity to 10 if mice are vulnerable to a predator
    //       mouse.set("mating chance", -.025 * this.numMice + .25);
    //     }
    //   })
    // }
  });
  return interactive;
}
