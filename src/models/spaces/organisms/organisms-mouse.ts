import { types, Instance } from "mobx-state-tree";
import { MouseColor, BackpackMouse } from "../../backpack-mouse";
import { getSubstanceBaseValueForColor } from "./organisms-space";
import { v4 as uuid } from "uuid";

export const kOrganelleNames = [
  "nucleus",
  "cytoplasm",
  "golgi",
  "extracellular",
  "melanosome",
  "receptor",
  "receptorWorking",
  "receptorBroken",
  "gate",
  "nearbyCell"
];
export const Organelle = types.enumeration("Organelle", kOrganelleNames);
export type OrganelleType = typeof Organelle.Type;

export const kSubstanceNames = [
  "pheomelanin",
  "signalProtein",
  "eumelanin",
  "hormone"
];
export const Substance = types.enumeration("Substance", kSubstanceNames);
export type SubstanceType = typeof Substance.Type;

const SubstanceDelta = types
  .model("SubstanceDelta", {
    amount: 0,
    decayStart: 0
  })
  .actions(self => ({
    setAmount(amount: number) {
      self.amount = amount;
    },

    setDecayStart(time: number) {
      self.decayStart = time;
    }
  }));

const OrganelleSubstanceDeltas = types
  .model("OrganelleSubstanceDeltas", {
    matrix: types.map(types.map(SubstanceDelta)),
    organismColor: MouseColor
  })
  .views(self => ({
    getDeltaForOrganelleSubstance(organelle: OrganelleType, substance: SubstanceType) {
      return self.matrix.get(organelle)!.get(substance)!;
    }
  }))
  .actions(self => ({
    afterCreate() {
      // Initialize all possible organelle substance deltas to 0
      kOrganelleNames.forEach((organelle: OrganelleType) => {
        self.matrix.set(organelle, {});
        kSubstanceNames.forEach((substance: SubstanceType) => {
          self.matrix.get(organelle)!.set(substance, SubstanceDelta.create());
        });
      });
    },

    addSubstanceToOrganelle(organelle: OrganelleType, substance: SubstanceType, inc: number, decayStart?: number) {
      const delta = self.getDeltaForOrganelleSubstance(organelle, substance);
      delta.setAmount(delta.amount + inc);

      if (decayStart) {
        delta.setDecayStart(decayStart);
      }
    },

    step(
      newTime: number,
      extracellularHormone: number,
      cytoplasmProtein: number,
      melanosomeEumelanin: number,
      melanosomePheomelanin: number)
    {
      kOrganelleNames.forEach((organelle: OrganelleType) => {
        kSubstanceNames.forEach((substance: SubstanceType) => {
          const delta = self.getDeltaForOrganelleSubstance(organelle, substance);

          if (newTime < delta.decayStart) {
            return;
          }

          let birthRate;
          let deathRate;
          switch (substance) {
            case "hormone":
              birthRate = organelle === "extracellular"
                ? 300 / 20
                : 0;
              deathRate = (100 + 1.6 * extracellularHormone) / 20;
              break;
            case "signalProtein":
              birthRate = organelle === "cytoplasm"
                ? self.organismColor === "brown"
                  ? (180 + .8 * extracellularHormone) / 10
                  : self.organismColor === "tan"
                    ? (90 + .8 * extracellularHormone) / 10
                    : 25 / 10
                : 0;
              deathRate = (25 + 1.5 * cytoplasmProtein) / 10;
              break;
            case "eumelanin":
              birthRate = organelle === "melanosome"
                ? self.organismColor !== "white"
                  ? (280 + 1.5 * cytoplasmProtein) / 10
                  : (25 + 1.8 * cytoplasmProtein) / 10
                : 0;
              deathRate = (25 + 1.5 * melanosomeEumelanin) / 10;
              break;
            case "pheomelanin":
              birthRate = organelle === "melanosome"
                ? (500 - 1.5 * cytoplasmProtein) / 10
                : 0;
              deathRate = (25 + 1.5 * melanosomePheomelanin) / 10;
              break;
            default:
              birthRate = 0;
              deathRate = 0;
              break;
          }

          delta.setAmount(delta.amount + birthRate - deathRate);
        });
      });
    }
  }));

export const OrganismsMouseModel = types
  .model("OrganismsMouse", {
    id: types.optional(types.identifier, () => uuid()),
    backpackMouse: types.reference(BackpackMouse),
    substanceDeltas: types.maybe(OrganelleSubstanceDeltas),
    time: 0,
    paused: false
  })
  .views(self => {
    function getSubstanceValue(organelle: OrganelleType, substance: SubstanceType) {
      const baseValue = getSubstanceBaseValueForColor(organelle, substance, self.backpackMouse.baseColor);
      const delta = self.substanceDeltas!.getDeltaForOrganelleSubstance(organelle, substance);

      if (delta) {
        return baseValue + delta.amount;
      } else {
        return baseValue;
      }
    }

    function getPercentDarkness() {
      const eumelaninLevel = getSubstanceValue("melanosome", "eumelanin");
      return Math.max(0, Math.min(1, eumelaninLevel / 500)) * 100;
    }

    return {
      getSubstanceValue,
      getPercentDarkness,
      get modelProperties() {
        const darkness = self.backpackMouse.baseColor === "white"
          ? 0
          : self.backpackMouse.baseColor === "tan"
            ? 1
            : 2;
        return {
          albino: false,
          working_tyr1: false,
          working_myosin_5a: true,
          open_gates: false,
          eumelanin: getPercentDarkness(),
          hormone_spawn_period: 40,
          base_darkness: darkness
        };
      }
    };
  })
  .actions((self) => ({
    // Actions invoked in a callback must be performed on `self` - such functions are defined here for use below
    incrementTime(millis: number) {
      self.time += millis;
    },
  }))
  .actions(self => {
    function afterCreate() {
      self.substanceDeltas = OrganelleSubstanceDeltas.create({organismColor: self.backpackMouse.baseColor});
      setInterval(() => {
        if (!self.paused) {
          stepSubstanceAdditions();
          self.incrementTime(100);
        }
      }, 100);
    }

    function setPaused(paused: boolean) {
      self.paused = paused;
    }

    function stepSubstanceAdditions() {
      const extracellularHormone = self.getSubstanceValue("extracellular", "hormone");
      const cytoplasmProtein = self.getSubstanceValue("cytoplasm", "signalProtein");
      const melanosomeEumelanin = self.getSubstanceValue("melanosome", "eumelanin");
      const melanosomePheomelanin = self.getSubstanceValue("melanosome", "pheomelanin");
      self.substanceDeltas!.step(
        self.time,
        extracellularHormone,
        cytoplasmProtein,
        melanosomeEumelanin,
        melanosomePheomelanin
      );
    }

    function addSubstance(organelle: OrganelleType, substance: SubstanceType, amount: number) {
      self.substanceDeltas!.addSubstanceToOrganelle(organelle, substance, amount, self.time + 3500);
    }

    return {
      setPaused,
      afterCreate,
      addSubstance
    };
  });

export type OrganismsMouseModelType = Instance<typeof OrganismsMouseModel>;
