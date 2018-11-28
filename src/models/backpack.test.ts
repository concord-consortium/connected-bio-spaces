import { BackpackModel, BackpackModelType } from "./backpack";
import { Mouse } from "./mouse";

describe("backpack model", () => {
  let backpack: BackpackModelType;

  beforeEach(() => {
    backpack = BackpackModel.create();
  });

  it("has default values", () => {
    expect(backpack.collectedMice).toEqual([]);
  });

  it("uses changes values", () => {
    backpack.addCollectedMouse(Mouse.create({sex: "male", genotype: "BB"}));
    expect(backpack.collectedMice.length).toBe(1);
    backpack.removeCollectedMouse(0);
    expect(backpack.collectedMice.length).toBe(0);
  });

  it("has a maximum number of slots that can be used", () => {
    for (let i = 0; i < 5; i++) {
      backpack.addCollectedMouse(Mouse.create({sex: "male", genotype: "BB"}));
    }
    expect(backpack.collectedMice.length).toBe(5);

    let addedSucessfully = backpack.addCollectedMouse(Mouse.create({sex: "male", genotype: "BB"}));
    expect(addedSucessfully).toBe(true);
    expect(backpack.collectedMice.length).toBe(6);

    addedSucessfully = backpack.addCollectedMouse(Mouse.create({sex: "male", genotype: "BB"}));
    expect(addedSucessfully).toBe(false);
    expect(backpack.collectedMice.length).toBe(6);
  });
});
