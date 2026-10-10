import { ServerGeoapifySchema } from "~/server-env/schema/ServerGeoapifySchema";
import { withLocationConfigFn } from "~/session-location/fn/withLocationConfigFn";

export const withTestGeoapifyFn = () => {
	const config = ServerGeoapifySchema.parse(process.env);

	return withLocationConfigFn({
		api: "https://api.geoapify.com",
		autocomplete: "/v1/geocode/autocomplete",
		geoapifyToken: config.SERVER_GEOAPIFY_TOKEN,
		route: "/v1/routematrix",
	});
};
