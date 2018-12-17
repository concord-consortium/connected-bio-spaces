import { BackpackMouse, BackpackMouseType } from "./backpack-mouse";

describe("mouse model", () => {
  let mouse: BackpackMouseType;

  beforeEach(() => {
    mouse = BackpackMouse.create({
      sex: "male",
      genotype: "RR",
      label: "lbl"
    });
  });

  it("has default values", () => {
    expect(mouse.sex).toBe("male");
    expect(mouse.genotype).toBe("RR");
    expect(mouse.label).toBe("lbl");
  });

  it("uses override values", () => {
    mouse = BackpackMouse.create({
      sex: "female",
      genotype: "CC",
      label: "lbl"
    });
    expect(mouse.sex).toBe("female");
    expect(mouse.genotype).toBe("CC");
    expect(mouse.label).toBe("lbl");
  });

});
