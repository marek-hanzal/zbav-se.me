import { Context } from "effect";

export interface LocationConfig {
	geoapifyToken: string;
	/**
	 * Base API url of (geoapify) service
	 */
	api: string;
	/**
	 * Autocomplete path (relative to api)
	 */
	autocomplete: string;
	/**
	 * Route path (relative to api)
	 */
	route: string;
}

export class LocationConfigFx extends Context.Tag("LocationConfigFx")<
	LocationConfigFx,
	LocationConfig
>() {
	//
}
