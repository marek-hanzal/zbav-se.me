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
}

export class LocationContextFx extends Context.Tag("LocationContextFx")<
	LocationContextFx,
	LocationContext
>() {
	//
}
