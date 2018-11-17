import { Mouse, MouseType } from "./mouse";

describe("mouse model", () => {
  let mouse: MouseType;

  beforeEach(() => {
    mouse = Mouse.create({sex: "male", genotype: "BB"});
  });

  it("has default values", () => {
    expect(mouse.sex).toBe("male");
    expect(mouse.genotype).toBe("BB");
  });

  it("uses override values", () => {
    mouse = Mouse.create({
      sex: "female",
      genotype: "bb"
    });
    expect(mouse.sex).toBe("female");
    expect(mouse.genotype).toBe("bb");
  });

});
