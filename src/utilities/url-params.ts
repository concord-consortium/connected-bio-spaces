import { ConnectedBioAuthoring } from "../authoring";

export interface QueryParams extends ConnectedBioAuthoring {
  authoring?: boolean;
}

let params: QueryParams;

try {
  const queryString = location.search.length > 1 ? decodeURIComponent(location.search.substring(1)) : "{}";
  params = JSON.parse(queryString);
} catch (e) {
  params = {};
}

if (location.search === "?authoring") {
  params.authoring = true;
}

export const urlParams: QueryParams = params;
