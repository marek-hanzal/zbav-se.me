import type { Routes } from "~/hono/Routes";
import { withLocationAutocompleteApi } from "./autocomplete";
import { withLocationFetchApi } from "./fetch";

export const withLocationApi: Routes.Fn = async (routes) => {
	await withLocationAutocompleteApi(routes);
	await withLocationFetchApi(routes);
};
