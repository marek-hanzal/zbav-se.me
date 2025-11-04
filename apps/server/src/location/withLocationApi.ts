import type { Routes } from "../hono/Routes";
import { withLocationAutocompleteApi } from "./endpoint/location-autocomplete";
import { withLocationFetchApi } from "./endpoint/location-fetch";

export const withLocationApi: Routes.Fn = (routes) => {
	withLocationAutocompleteApi(routes);
	withLocationFetchApi(routes);
};
