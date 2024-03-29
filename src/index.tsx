import { Provider } from "mobx-react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as iframePhone from "iframe-phone";
import { merge } from "lodash";

import { AppComponent } from "./components/app";
import { createStores, getUserSnapshot, UserSaveDataType, ConnectedBioModelCreationType } from "./models/stores";

import { defaultAuthoring } from "./components/authoring";
import { urlParams } from "./utilities/url-params";
import { AuthoringComponent } from "./components/authoring";

import "./index.sass";
import { onSnapshot } from "mobx-state-tree";
import scaleToFit from "./components/hoc/scaleToFit";
import { MiceAuthoringComponent } from "./components/authoring-mice";
import { PeasAuthoringComponent } from "./components/authoring-peas";

let modelInitialized = false;

const ASPECT_RATIO = 1.66;
const ASPECT_RATIO_TOP_BAR = 1.6;
const DEFAULT_WIDTH = 1000;     // scale = 1.0. All font sizes etc. will be respective to this, so
                                // the larger the width, the smaller the font and title/side-bars
const MINIMUM_WIDTH = 300;
export const DEFAULT_MODEL_WIDTH = DEFAULT_WIDTH * 0.414;

const NARROW_WIDTH = 870;       // if we remove left panel, we use this width but keep all other calcs. the same

const SAVE_STATE_KEY = "cbioSaveState";
const localStorage = (window as any).localStorage;

function initializeModel(studentData: UserSaveDataType) {
  if (modelInitialized) return;
  modelInitialized = true;

  const initialStore: ConnectedBioModelCreationType = merge({}, defaultAuthoring, urlParams, studentData);

  const appRoot = document.getElementById("app");

  if (urlParams.authoring || window.location.pathname.indexOf("authoring") >= 0) {
    appRoot!.classList.add("authoring");
  }

  if (urlParams.authoring) {
    ReactDOM.render((
      <AuthoringComponent initialAuthoring={initialStore} />
      ), appRoot
    );
  } else if (window.location.pathname.indexOf("mice-authoring") >= 0) {
    const miceInitialStore = {
      ...initialStore,
      ui: {
        ...initialStore.ui,
        investigationPanelSpace: "populations"
      }
    } as ConnectedBioModelCreationType;
    ReactDOM.render((
      <MiceAuthoringComponent initialAuthoring={miceInitialStore} />
      ), appRoot
    );
  } else if (window.location.pathname.indexOf("peas-authoring") >= 0) {
    const peasInitialStore = {
      ...initialStore,
      unit: "pea",
      leftPanel: false,
      ui: {
        ...initialStore.ui,
        investigationPanelSpace: "breeding",
        showPopulationSpace: false,
        showOrganismSpace: false
      }
    } as ConnectedBioModelCreationType;
    ReactDOM.render((
      <PeasAuthoringComponent initialAuthoring={peasInitialStore} />
      ), appRoot
    );
  } else {
    const stores = createStores( initialStore );

    // Save data everytime stores change
    const saveUserData = () => {
      const saveState = getUserSnapshot(stores);
      (window as any).saveState = saveState;      // for console inspection

      phone.post("interactiveState", saveState);

      if (urlParams.saveToLocalStore) {
        localStorage.setItem(SAVE_STATE_KEY, JSON.stringify(saveState));
      }
    };
    onSnapshot(stores.backpack, saveUserData);
    onSnapshot(stores.ui, saveUserData);
    if (stores.organisms) {
      onSnapshot(stores.organisms, saveUserData);
    }
    onSnapshot(stores.breeding, saveUserData);

    const outerWrapperStyle = { className: "outer-scale-wrapper" };
    const aspectRatio = initialStore.topBar ? ASPECT_RATIO_TOP_BAR : ASPECT_RATIO;
    const width = initialStore.leftPanel ? DEFAULT_WIDTH : NARROW_WIDTH;
    const contentFn = () => { return { width, height: DEFAULT_WIDTH / aspectRatio,
                                        minWidth: MINIMUM_WIDTH, minHeight: MINIMUM_WIDTH / aspectRatio }; };
    const ScaledAppContainer = scaleToFit(outerWrapperStyle, true, contentFn)(AppComponent);

    ReactDOM.render(
      <Provider stores={stores}>
        <ScaledAppContainer showTopBar={initialStore.topBar} showLeftPanel={initialStore.leftPanel} />
      </Provider>,
      appRoot
    );
  }
}

// If we are embedded in LARA, wait for `initInteractive` and initialize model with any student data
const phone = iframePhone.getIFrameEndpoint();
phone.addListener("initInteractive", (data: {
    mode: any,
    authoredState: any,
    interactiveState: any,
    linkedState: any}) => {
  const studentData: UserSaveDataType = data && (data.interactiveState || data.linkedState) || {};
  initializeModel(studentData);
});

// When we exit page and LARA asks for student data, tell it it's already up-to-date
phone.addListener("getInteractiveState", () => {
  phone.post("interactiveState", "nochange");
});

phone.initialize();

phone.post("supportedFeatures", {
  apiVersion: 1,
  features: {
    interactiveState: true,
    aspectRatio: ASPECT_RATIO
  }
});

if (urlParams.saveToLocalStore && localStorage.getItem(SAVE_STATE_KEY)) {
  initializeModel(JSON.parse(localStorage.getItem(SAVE_STATE_KEY)));
}

// If we do not receive `initInteractive`, we are not embedded in LARA
setTimeout( (() => initializeModel({})), 500);
