import { BasicAnimal, Species, Trait, Agent, AgentDistance } from "populations.js";

let nextZIndex = 2;

class Hawk extends BasicAnimal {

  private _circleCount = 0;
  private _baseZIndex = nextZIndex;

  constructor(args: any) {
    super(args);
    this.label = "Hawk";
    this._viewLayer = 3;
    (this as any).zIndex(this._baseZIndex);
    nextZIndex++;
  }

  public isInteractive() {      // FIXME: Would be nice to set this better in populations
    return false;
  }

  public makeNewborn() {
    super.makeNewborn();
    this._circleCount = Math.random() * 2;
  }

  public wander() {
    let newHeight = this.get("height") + 1;
    newHeight = Math.min(newHeight, 10);
    this.set("height", newHeight);
    // a lower hawk is always below a higher one, and at the same level one is always higher
    (this as any).zIndex(this._baseZIndex + (newHeight * 10));
    this.set("current behavior", BasicAnimal.BEHAVIOR.WANDERING);
    const speed = this.get("speed") - 3;
    const delta = Math.sqrt(10 / (1 + (9 * Math.pow(Math.cos(this._circleCount), 2)))) * Math.cos(this._circleCount);
    let newDir = this.get("direction") + (delta / 25);
    this.set("direction", newDir);
    // if we are nearing the edges, turn harder
    const loc = this.getLocation();
    if (loc.x < 120 || loc.x > (this as any).environment.width - 120
        || loc.y < 120 || loc.y > (this as any).environment.height - 120) {
      const dx = speed * 20 * Math.cos(newDir);
      const dy = speed * 20 * Math.sin(newDir);
      if ((this as any).environment.crossesBarrier(loc, {
        x: loc.x + dx,
        y: loc.y + dy
      })) {
        newDir = this.get("direction") + (delta / 15);
        this.set("direction", newDir);
      }
    }
    this._circleCount += 0.01;
    return this.move(speed);
  }

  public chase(agentDistance: AgentDistance) {
    super.chase(agentDistance);

    let newHeight = this.get("height") - 1;
    newHeight = Math.max(newHeight, 1);
    this.set("height", newHeight);
    (this as any).zIndex(this._baseZIndex + (newHeight * 10));
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
    new Trait({ name: "is immortal", default: true }),
    new Trait({ name: "height", default: 10 })
  ],
  imageProperties: {
    rotate: true,
    initialRotationDirection: -Math.PI / 2
  },
  imageRules: [{
    name: "hawk",
    contexts: ["environment"],
    rules: [{
      image: {
        path: "assets/unit/mouse/populations/hawk.png",
        // Annoying that we can't simply make scale a computed property.
        // Something for the next version of populations.js ...
        scale: 0.18,
        anchor: {
          x: 0.5,
          y: 0.2
        }
      },
      useIf: (agent: Agent) => agent.get("height") <= 2
    }, {
      image: {
        path: "assets/unit/mouse/populations/hawk.png",
        scale: 0.185,
        anchor: {
          x: 0.5,
          y: 0.2
        }
      },
      useIf: (agent: Agent) => agent.get("height") <= 3
    }, {
      image: {
        path: "assets/unit/mouse/populations/hawk.png",
        scale: 0.19,
        anchor: {
          x: 0.5,
          y: 0.2
        }
      },
      useIf: (agent: Agent) => agent.get("height") <= 4
    }, {
      image: {
        path: "assets/unit/mouse/populations/hawk.png",
        scale: 0.195,
        anchor: {
          x: 0.5,
          y: 0.2
        }
      },
      useIf: (agent: Agent) => agent.get("height") <= 5
    }, {
      image: {
        path: "assets/unit/mouse/populations/hawk.png",
        scale: 0.21,
        anchor: {
          x: 0.5,
          y: 0.2
        }
      },
      useIf: (agent: Agent) => agent.get("height") <= 6
    }, {
      image: {
        path: "assets/unit/mouse/populations/hawk.png",
        scale: 0.215,
        anchor: {
          x: 0.5,
          y: 0.2
        }
      },
      useIf: (agent: Agent) => agent.get("height") <= 7
    }, {
      image: {
        path: "assets/unit/mouse/populations/hawk.png",
        scale: 0.22,
        anchor: {
          x: 0.5,
          y: 0.2
        }
      },
      useIf: (agent: Agent) => agent.get("height") <= 8
    }, {
      image: {
        path: "assets/unit/mouse/populations/hawk.png",
        scale: 0.225,
        anchor: {
          x: 0.5,
          y: 0.2
        }
      },
      useIf: (agent: Agent) => agent.get("height") <= 9
    },
    {
      image: {
        path: "assets/unit/mouse/populations/hawk.png",
        scale: 0.23,
        anchor: {
          x: 0.5,
          y: 0.2
        }
      }
    }]
  }]
});
