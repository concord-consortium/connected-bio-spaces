export interface QueryParams {
  topBar?: boolean;
  authoring?: boolean;
}

let params: any;

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
