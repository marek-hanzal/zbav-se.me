import { Effect } from "effect";
import { withCorsProxyApiFx } from "~/@public/cors/cors-proxy";

export const withCorsApiFx = Effect.fn("withCorsApiFx")(function* () {
	yield* withCorsProxyApiFx();
});
