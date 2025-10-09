import {
	createStartHandler,
	defaultStreamHandler,
} from "@tanstack/react-start/server";
import { bootstrap } from "~/app/database/kysely";

export default {
	fetch: createStartHandler(async (ctx) => {
		await bootstrap();

		return defaultStreamHandler(ctx);
	}),
};
