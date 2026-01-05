import type { Routes } from "~/hono/Routes";
import { withLocationAutocompleteApi } from "./location-autocomplete";
import { withLocationFetchApi } from "./location-fetch";

export const withLocationApi: Routes.Fn = async (routes) => {
	await withLocationAutocompleteApi(routes);
	await withLocationFetchApi(routes);
};
