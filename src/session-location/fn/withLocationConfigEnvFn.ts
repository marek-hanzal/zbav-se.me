import { ServerGeoapifySchema } from "~/server-env/schema/ServerGeoapifySchema";
import type { LocationConfig } from "~/session-location/context/LocationConfigFx";

export namespace withLocationConfigEnvFn {
	export interface Props extends Omit<LocationConfig, "geoapifyToken"> {
		//
	}
}

export const withLocationConfigEnvFn = (props: withLocationConfigEnvFn.Props): LocationConfig => {
	const { SERVER_GEOAPIFY_TOKEN } = ServerGeoapifySchema.parse(process.env);

	return {
		...props,
		geoapifyToken: SERVER_GEOAPIFY_TOKEN,
	};
};
