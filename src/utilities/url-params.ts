import { defaultAuthoring } from "../components/authoring";

export interface QueryParams {
  topBar?: boolean;
  authoring?: boolean;
}

let params: any;

try {
  const queryString = location.search.length > 1 ? decodeURIComponent(location.search.substring(1)) : "{}";
  params = Object.assign(defaultAuthoring, JSON.parse(queryString));
} catch (e) {
  params = {
    authoring: false,
    ...defaultAuthoring
  };
}

if (location.search === "?authoring") {
  params.authoring = true;
}

export const urlParams: QueryParams = params;
