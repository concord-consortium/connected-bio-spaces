import { createStores, IStores } from "./stores";
import { defaultAuthoring } from "../components/authoring";
import { MousePopulationsModelType } from "./spaces/populations/mouse-model/mouse-populations-model";

describe("stores object", () => {

  let stores: IStores;

  beforeEach(() => {
    if (stores) {
      // Clear up state, or tests after the first complain about duplicate objects in MST
      stores.organisms.clearRowBackpackMouse(0);
      stores.organisms.clearRowBackpackMouse(1);
    }
    stores = createStores({}, defaultAuthoring);
  });

  it("supports creating dummy stores for testing", () => {
    expect(stores).toBeDefined();
    expect(stores.ui).toBeDefined();
    expect(stores.populations).toBeDefined();
  });

  describe("with default authoring", () => {

    it("are set up with the correct properties", () => {
      expect(stores.ui).toBeDefined();
      expect(stores.populations).toBeDefined();
      expect(stores.populations.model).toBeDefined();
      const mouseModel = stores.populations.model as MousePopulationsModelType;
      expect(mouseModel.numHawks).toBe(2);
      expect(mouseModel.environment).toBe("white");
    });

  });

});
