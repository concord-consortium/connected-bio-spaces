import { createStores } from "./stores";
import { defaultAuthoring } from "../components/authoring";

describe("stores object", () => {

  it("supports creating dummy stores for testing", () => {
    const stores = createStores({}, defaultAuthoring);
    expect(stores).toBeDefined();
    expect(stores.ui).toBeDefined();
  });

});
