import { ServerGeoapifySchema } from "~/server/env/ServerGeoapifySchema";
import type { LocationConfig } from "../context/LocationConfigFx";

export namespace withLocationConfigEnv {
	export interface Props extends Omit<LocationConfig, "geoapifyToken"> {
		//
	}
}

export const withLocationConfigEnv = (props: withLocationConfigEnv.Props): LocationConfig => {
	const { SERVER_GEOAPIFY_TOKEN } = ServerGeoapifySchema.parse(process.env);

	return {
		...props,
		geoapifyToken: SERVER_GEOAPIFY_TOKEN,
	};
};
