import { Effect } from "effect";
import { LoggerContextFx } from "~/log/service/LoggerContextFx";

export const getLoggerFx = Effect.fn("getLoggerFx")(function* (name: string, domain?: string) {
	return (yield* LoggerContextFx).getChild(
		domain
			? [
					domain,
					"fx",
					name,
				]
			: [
					"fx",
					name,
				],
	);
});
