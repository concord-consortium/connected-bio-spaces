import { Mouse, MouseType } from "./mouse";

describe("mouse model", () => {
  let mouse: MouseType;

  beforeEach(() => {
    mouse = Mouse.create({
      sex: "male",
      genotype: "BB",
      label: "lbl"
    });
  });

  it("has default values", () => {
    expect(mouse.sex).toBe("male");
    expect(mouse.genotype).toBe("BB");
    expect(mouse.label).toBe("lbl");
  });

  it("uses override values", () => {
    mouse = Mouse.create({
      sex: "female",
      genotype: "bb",
      label: "lbl"
    });
    expect(mouse.sex).toBe("female");
    expect(mouse.genotype).toBe("bb");
    expect(mouse.label).toBe("lbl");
  });

});
