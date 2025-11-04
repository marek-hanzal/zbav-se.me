import { AppEnv } from "../../../../AppEnv";
import type { Routes } from "../../../../hono/Routes";

export const withOriginEndpoint: Routes.Fn = ({ root }) => {
	root.get("/origin", (c) =>
		c.json({
			origin: [
				AppEnv.VITE_WEB_ORIGIN,
				AppEnv.VITE_APP_ORIGIN,
			],
		}),
	);
};
