import { types, Instance } from "mobx-state-tree";
import { BackpackMouse } from "../../backpack-mouse";
import { kOrganelleInfo } from "./organisms-space";
import { v4 as uuid } from "uuid";

export const Organelle = types.enumeration("Organelle", [
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
]);
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

const kAssayableOrganelles: OrganelleType[] = ["extracellular", "cytoplasm", "melanosome"];
export const OrganismsMouseModel = types
  .model("OrganismsMouse", {
    id: types.optional(types.identifier, () => uuid()),
    backpackMouse: types.reference(BackpackMouse),
    substanceDeltas: types.map(types.map(SubstanceDelta)),
    time: 0,
    paused: false
  })
  .views(self => {

    function getSubstanceBaseValue(organelle: OrganelleType, substance: SubstanceType) {
      const color = self.backpackMouse.baseColor;
      const substanceValues = kOrganelleInfo[organelle].substances[substance];
      return substanceValues ? substanceValues[color] : 0;
    }

    function getSubstanceDelta(organelle: OrganelleType, substance: SubstanceType) {
      return self.substanceDeltas.get(organelle)!.get(substance)!;
    }

    function getSubstanceValue(organelle: OrganelleType, substance: SubstanceType) {
      const baseValue = getSubstanceBaseValue(organelle, substance);
      const delta = getSubstanceDelta(organelle, substance);

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
      getSubstanceBaseValue,
      getSubstanceDelta,
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
    let timerId: NodeJS.Timer;

    function afterCreate() {
      // Initialize all possible organelle substance deltas to 0
      kAssayableOrganelles.forEach((organelle: OrganelleType) => {
        self.substanceDeltas.set(organelle, {});
        kSubstanceNames.forEach((substance: SubstanceType) => {
          self.substanceDeltas.get(organelle)!.set(substance, SubstanceDelta.create());
        });
      });

      timerId = setInterval(() => {
        if (!self.paused) {
          stepSubstanceAdditions();
          self.incrementTime(100);
        }
      }, 100);
    }

    function beforeDestroy() {
      clearInterval(timerId);
    }

    function setPaused(paused: boolean) {
      self.paused = paused;
    }

    function stepSubstanceAdditions() {
      const extracellularHormone = self.getSubstanceValue("extracellular", "hormone");
      const cytoplasmProtein = self.getSubstanceValue("cytoplasm", "signalProtein");
      const melanosomeEumelanin = self.getSubstanceValue("melanosome", "eumelanin");
      const melanosomePheomelanin = self.getSubstanceValue("melanosome", "pheomelanin");

      const organismColor = self.backpackMouse.baseColor;

      kAssayableOrganelles.forEach((organelle: OrganelleType) => {
        kSubstanceNames.forEach((substance: SubstanceType) => {
          const delta = self.getSubstanceDelta(organelle, substance);

          if (self.time < delta.decayStart) {
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
                ? organismColor === "brown"
                  ? (180 + .8 * extracellularHormone) / 10
                  : organismColor === "tan"
                    ? (90 + .8 * extracellularHormone) / 10
                    : 25 / 10
                : 0;
              deathRate = (25 + 1.5 * cytoplasmProtein) / 10;
              break;
            case "eumelanin":
              birthRate = organelle === "melanosome"
                ? organismColor !== "white"
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

          // You can never subtract more of a substance than there is to begin with
          const minDelta = -1 * self.getSubstanceBaseValue(organelle, substance);
          delta.setAmount(Math.max(delta.amount + birthRate - deathRate, minDelta));
        });
      });
    }

    function addSubstance(organelle: OrganelleType, substance: SubstanceType, inc: number) {
      const delta = self.getSubstanceDelta(organelle, substance);
      delta.setAmount(delta.amount + inc);
      delta.setDecayStart(self.time + 3500);
    }

    return {
      afterCreate,
      beforeDestroy,
      setPaused,
      addSubstance
    };
  });

export type OrganismsMouseModelType = Instance<typeof OrganismsMouseModel>;
