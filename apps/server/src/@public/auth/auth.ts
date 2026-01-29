import { Effect } from "effect";
import { auth } from "~/auth/auth";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";

export const withAuthEndpointFx = Effect.fn("withAuthEndpointFx")(function* () {
	const { root } = yield* RoutesContextFx;
	const { dialect } = yield* KyselyContextFx;

	const { handler } = auth(() => dialect);

	root.on(
		[
			"POST",
			"GET",
		],
		"/api/auth/*",
		(c) => handler(c.req.raw),
	);
});
