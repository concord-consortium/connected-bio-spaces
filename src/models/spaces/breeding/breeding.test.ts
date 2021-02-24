import { NestPair } from "./breeding";
import { destroy, detach } from "mobx-state-tree";

describe("NestPair model", () => {

  describe("that is created using metadata", () => {
    const litterMeta = {
      litters: 5,
      offspringByGenotype: {
        CC: 10,
        CR: 6,
        RC: 4,
        RR: 0
      }
    };
    const nestPair = NestPair.create({
      leftMouse: {species: "mouse", sex: "female", genotype: "CR"},
      rightMouse: {species: "mouse", sex: "male", genotype: "RC"},
      label: "Test Label",
      chartLabel: "Chart Label",
      condensedLitterMeta: JSON.stringify(litterMeta)
    });

    it ("will have the right number of litters", () => {
      expect(nestPair.litters.length).toBe(5);
    });

    it ("will have the right number of offspring", () => {
      expect(nestPair.numOffspring).toBe(20);
    });

    it ("will have between 3 and 5 offspring per litter", () => {
      for (const litter of nestPair.litters) {
        expect(litter.length).toBeGreaterThanOrEqual(3);
        expect(litter.length).toBeLessThanOrEqual(5);
      }
    });

    it ("will have the right number of offspring of each genotype", () => {
      const counts: Record<string, number> = {
        CC: 0,
        CR: 0,
        RC: 0,
        RR: 0
      };
      nestPair.litters.forEach(litter => {
        litter.forEach(mouse => {
          counts[mouse.genotype]++;
        });
      });
      expect(counts.CC).toBe(litterMeta.offspringByGenotype.CC);
      expect(counts.CR).toBe(litterMeta.offspringByGenotype.CR);
      expect(counts.RC).toBe(litterMeta.offspringByGenotype.RC);
      expect(counts.RR).toBe(litterMeta.offspringByGenotype.RR);
    });
  });
});
