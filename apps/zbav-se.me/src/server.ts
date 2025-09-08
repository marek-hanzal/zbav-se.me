import type { AnyRouter } from "@tanstack/react-router";
import {
	createStartHandler,
	defaultStreamHandler,
	type HandlerCallback,
} from "@tanstack/react-start/server";
import { createRouter } from "~/router";

const withGlobalHeaders = <R extends AnyRouter>(
	handler: HandlerCallback<R>,
): HandlerCallback<R> => {
	return (ev) =>
		Promise.resolve(handler(ev)).then((res) => {
			res.headers.set("Cross-Origin-Opener-Policy", "same-origin");
			res.headers.set("Cross-Origin-Embedder-Policy", "require-corp");
			return res;
		});
};

export default createStartHandler({
	createRouter,
})(withGlobalHeaders(defaultStreamHandler));
