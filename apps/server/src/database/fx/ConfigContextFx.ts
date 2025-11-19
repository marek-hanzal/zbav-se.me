import { Context, Effect } from "effect";

export interface ConfigContext {
	/**
	 * Number of days until a listing transaction expires.
	 * Defaults to 3 days.
	 */
	listingTransactionExpiresAt: number;
}

export class ConfigContextFx extends Context.Tag("ConfigContextFx")<ConfigContextFx, ConfigContext>() {
	//
}

export const ConfigContextProvider = (config: ConfigContext) => {
	return Effect.provideService(ConfigContextFx, config);
};
