import { Context } from "effect";

export interface LocationContext {
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

export class LocationContextFx extends Context.Tag("LocationContextFx")<
	LocationContextFx,
	LocationContext
>() {
	//
}
