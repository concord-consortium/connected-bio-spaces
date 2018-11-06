import { Provider } from "mobx-react";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { AppComponent } from "./components/app";
import { createStores } from "./models/stores";

import "./index.sass";
import { urlParams } from "./utilities/url-params";
import { AuthoringComponent } from "./components/authoring";

const stores = createStores({ appMode: urlParams.appMode });

if (urlParams.authoring) {
  ReactDOM.render((
    <AuthoringComponent />
    ), document.getElementById("app")
  );
} else {
  ReactDOM.render(
    <Provider stores={stores}>
      <AppComponent />
    </Provider>,
    document.getElementById("app")
  );
}
