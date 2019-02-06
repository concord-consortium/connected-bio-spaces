import { Provider } from "mobx-react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as iframePhone from "iframe-phone";
import { merge } from "lodash";

import { AppComponent } from "./components/app";
import { createStores, getUserSnapshot } from "./models/stores";

import { defaultAuthoring } from "./components/authoring";
import { urlParams } from "./utilities/url-params";
import { AuthoringComponent } from "./components/authoring";

import "./index.sass";
import { onSnapshot } from "mobx-state-tree";

let modelInitialized = false;

function initializeModel(studentData: any) {
  if (modelInitialized) return;
  modelInitialized = true;

  const initialStore = merge({}, defaultAuthoring, urlParams, studentData);
  const stores = createStores( initialStore );

  // Save data everytime stores change
  function saveUserData() {
    phone.post("interactiveState", getUserSnapshot(stores));
  }
  onSnapshot(stores.backpack, saveUserData);
  onSnapshot(stores.ui, saveUserData);
  onSnapshot(stores.organisms, saveUserData);

  const appRoot = document.getElementById("app");

  if (urlParams.authoring) {
    appRoot!.classList.add("authoring");
    ReactDOM.render((
      <AuthoringComponent />
      ), appRoot
    );
  } else {
    ReactDOM.render(
      <Provider stores={stores}>
        <AppComponent showTopBar={initialStore.topBar} />
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
  const studentData = data && (data.interactiveState || data.linkedState) || {};
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
    interactiveState: true
  }
});

// If we do not receive `initInteractive`, we are not embedded in LARA
setTimeout( (() => initializeModel({})), 500);
