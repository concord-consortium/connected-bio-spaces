import { BackpackModel, BackpackModelType } from "./backpack";
import { BackpackMouse } from "./backpack-mouse";

describe("backpack model", () => {
  let backpack: BackpackModelType;

  beforeEach(() => {
    backpack = BackpackModel.create();
  });

  it("has default values", () => {
    expect(backpack.collectedMice).toEqual([]);
  });

  it("uses changes values", () => {
    backpack.addCollectedMouse(BackpackMouse.create({species: "mouse", sex: "male", genotype: "RR"}));
    expect(backpack.collectedMice.length).toBe(1);
    backpack.removeCollectedMouse(0);
    expect(backpack.collectedMice.length).toBe(0);
  });

  it("has a maximum number of slots that can be used", () => {
    for (let i = 0; i < 5; i++) {
      backpack.addCollectedMouse(BackpackMouse.create({species: "mouse", sex: "male", genotype: "RR"}));
    }
    expect(backpack.collectedMice.length).toBe(5);

    let addedSucessfully = backpack.addCollectedMouse(BackpackMouse.create({
      species: "mouse", sex: "male", genotype: "RR"
    }));
    expect(addedSucessfully).toBe(true);
    expect(backpack.collectedMice.length).toBe(6);

    addedSucessfully = backpack.addCollectedMouse(BackpackMouse.create({
      species: "mouse", sex: "male", genotype: "RR"
    }));
    expect(addedSucessfully).toBe(false);
    expect(backpack.collectedMice.length).toBe(6);
  });
});
