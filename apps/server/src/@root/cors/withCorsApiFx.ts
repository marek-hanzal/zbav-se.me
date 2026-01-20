import { Effect } from "effect";
import { withCorsProxyApiFx } from "~/@root/cors/cors-proxy";

export const withCorsApiFx = Effect.fn("withCorsApiFx")(function* () {
	yield* withCorsProxyApiFx();
});
