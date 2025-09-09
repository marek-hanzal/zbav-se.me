import type { AnyRouter } from "@tanstack/react-router";
import {
	createStartHandler,
	defaultStreamHandler,
	type HandlerCallback,
} from "@tanstack/react-start/server";
import { bootstrap } from "~/app/database/kysely";
import { createRouter } from "~/router";

const withGlobalHeaders = <R extends AnyRouter>(
	handler: HandlerCallback<R>,
): HandlerCallback<R> => {
	return (props) =>
		Promise.resolve(handler(props)).then((res) => {
			// res.headers.set("Cross-Origin-Opener-Policy", "same-origin");
			// res.headers.set("Cross-Origin-Embedder-Policy", "require-corp");
			return res;
		});
};

export default createStartHandler({
	createRouter: async () => {
		await bootstrap();
		return createRouter();
	},
})(withGlobalHeaders(defaultStreamHandler));
