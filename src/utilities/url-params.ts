import { AppMode } from "../models/stores";

export interface QueryParams {
  appMode?: AppMode;
  topBar?: boolean;
  authoring?: boolean;
}

export const defaultUrlParams: QueryParams = {
  appMode: "dev",
  topBar: true,
  authoring: false
};

let params = defaultUrlParams;
try {
  const queryString = location.search.length > 1 ? decodeURIComponent(location.search.substring(1)) : "{}";
  params = Object.assign(defaultUrlParams, JSON.parse(queryString));
} catch (e) {
  // allows use of ?authoring for url
  if (location.search === "?authoring") {
    params.authoring = true;
  }
}

export const urlParams: QueryParams = params;
