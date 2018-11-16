import { createStores } from "./stores";
import { defaultAuthoring } from "../components/authoring";
import { MousePopulationsModelType } from "./spaces/populations/mouse-model/mouse-populations-model";

describe("stores object", () => {

  it("supports creating dummy stores for testing", () => {
    const stores = createStores({}, defaultAuthoring);
    expect(stores).toBeDefined();
    expect(stores.ui).toBeDefined();
    expect(stores.populations).toBeDefined();
  });

  describe("with default authoring", () => {

    it("are set up with the correct properties", () => {
      const stores = createStores({}, defaultAuthoring);
      expect(stores.populations.model).toBeDefined();
      const mouseModel = stores.populations.model as MousePopulationsModelType;
      expect(mouseModel.numHawks).toBe(2);
      expect(mouseModel.initialEnvironment).toBe("white");
    });

  });

});
