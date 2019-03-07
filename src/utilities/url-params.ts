import { ConnectedBioAuthoring } from "../authoring";

export interface QueryParams extends ConnectedBioAuthoring {
  authoring?: boolean;
}

let params: QueryParams;

try {
  const queryString = location.search.length > 1
    ? decodeURIComponent(location.search.substring(1).replace("authoring", ""))
    : "{}";
  params = JSON.parse(queryString);
} catch (e) {
  params = {};
}

if (location.search.indexOf("authoring") === 1) {
  params.authoring = true;
}

export const urlParams: QueryParams = params;
