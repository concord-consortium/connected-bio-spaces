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

});