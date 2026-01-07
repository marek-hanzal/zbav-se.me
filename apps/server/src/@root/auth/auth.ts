import { Effect } from "effect";
import { RoutesContextFx } from "~/app/routes/RoutesContextFx";
import { auth } from "~/auth/auth";
import { dialect } from "~/database/dialect";

export const withAuthEndpointFx = Effect.fn("withAuthEndpointFx")(function* () {
	const { root } = yield* RoutesContextFx;

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
