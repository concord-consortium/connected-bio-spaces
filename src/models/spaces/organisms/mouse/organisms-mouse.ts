import { types, Instance } from "mobx-state-tree";
import { BackpackMouse, ColorType } from "../../../backpack-mouse";
import { kOrganelleInfo } from "./mouse-cell-data";
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
  "hormone",
  "signalProtein",
  "pheomelanin",
  "eumelanin"
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
    paused: false
  })
  .extend(self => {

    let time = 0;

    const substanceDeltas = new Map();

    kAssayableOrganelles.forEach((organelle: OrganelleType) => {
      substanceDeltas.set(organelle, new Map());
      kSubstanceNames.forEach((substance: SubstanceType) => {
        substanceDeltas.get(organelle)!.set(substance, SubstanceDelta.create());
      });
    });

    function getSubstanceBaseValue(organelle: OrganelleType, substance: SubstanceType) {
      const color = self.backpackMouse.phenotype as ColorType;
      const substanceValues = kOrganelleInfo[organelle].substances[substance];
      return substanceValues ? substanceValues[color] : 0;
    }

    function getSubstanceDelta(organelle: OrganelleType, substance: SubstanceType) {
      return substanceDeltas.get(organelle)!.get(substance)!;
    }

    function getSubstanceValue(organelle: OrganelleType, substance: SubstanceType) {
      const baseValue = getSubstanceBaseValue(organelle, substance);
      const delta = getSubstanceDelta(organelle, substance);

      if (delta) {
        return Math.max(0, baseValue + delta.amount);
      } else {
        return baseValue;
      }
    }

    function getPercentDarkness() {
      const eumelaninLevel = getSubstanceValue("melanosome", "eumelanin");
      return Math.max(0, Math.min(1, eumelaninLevel / 500)) * 100;
    }

    const timerId = setInterval(() => {
      if (!self.paused) {
        stepSubstanceAdditions();
        incrementTime(100);
      }
    }, 100);

    function incrementTime(millis: number) {
      time += millis;
    }

    function beforeDestroy() {
      clearInterval(timerId);
    }

    function setPaused(paused: boolean) {
      self.paused = paused;
    }

    function stepSubstanceAdditions() {
      const extracellularHormone = getSubstanceValue("extracellular", "hormone");
      const cytoplasmProtein = getSubstanceValue("cytoplasm", "signalProtein");
      const melanosomeEumelanin = getSubstanceValue("melanosome", "eumelanin");
      const melanosomePheomelanin = getSubstanceValue("melanosome", "pheomelanin");

      const organismColor = self.backpackMouse.phenotype;

      kAssayableOrganelles.forEach((organelle: OrganelleType) => {
        kSubstanceNames.forEach((substance: SubstanceType) => {
          const delta = getSubstanceDelta(organelle, substance);

          if (time < delta.decayStart) {
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
                    ? (70 + .8 * extracellularHormone) / 10
                    : 25 / 10
                : 0;
              deathRate = (25 + 1.5 * cytoplasmProtein) / 10;
              break;
            case "eumelanin":
              birthRate = organelle === "melanosome"
                ? organismColor !== "brown"
                  ? (25 + 1.8 * cytoplasmProtein) / 10
                  : (280 + 1.5 * cytoplasmProtein) / 10
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
          const minDelta = -1 * getSubstanceBaseValue(organelle, substance);
          delta.setAmount(Math.max(delta.amount + birthRate - deathRate, minDelta));
        });
      });
    }

    function addSubstance(organelle: OrganelleType, substance: SubstanceType, inc: number) {
      const delta = getSubstanceDelta(organelle, substance);
      delta.setAmount(delta.amount + inc);
      delta.setDecayStart(time + 3500);
    }

    return {
      views: {
        getSubstanceBaseValue,
        getSubstanceDelta,
        getSubstanceValue,
        getPercentDarkness,
        get modelProperties() {
          const darkness = self.backpackMouse.phenotype === "white"
            ? 0
            : self.backpackMouse.phenotype === "tan"
              ? 1
              : 2;
          return {
            albino: false,
            working_tyr1: false,
            working_myosin_5a: true,
            open_gates: false,
            eumelanin: getPercentDarkness(),
            hormone_spawn_period: 45,
            base_darkness: darkness
          };
        }
      },
      actions: {
        beforeDestroy,
        setPaused,
        addSubstance
      }
    };
  });

export type OrganismsMouseModelType = Instance<typeof OrganismsMouseModel>;
