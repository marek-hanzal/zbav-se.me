import type { Routes } from "../../hono/Routes";
import { withLocationAutocompleteApi } from "./location-autocomplete";
import { withLocationFetchApi } from "./location-fetch";

export const withLocationApi: Routes.Fn = (routes) => {
	withLocationAutocompleteApi(routes);
	withLocationFetchApi(routes);
};
