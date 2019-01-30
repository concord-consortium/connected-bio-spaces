import { Provider } from "mobx-react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { merge } from "lodash";

import { AppComponent } from "./components/app";
import { createStores } from "./models/stores";

import { defaultAuthoring } from "./components/authoring";
import { urlParams } from "./utilities/url-params";
import { AuthoringComponent } from "./components/authoring";

import "./index.sass";

const initialStore = merge({}, defaultAuthoring, urlParams);

const stores = createStores( initialStore );

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
