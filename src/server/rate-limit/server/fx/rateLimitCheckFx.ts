import { Effect } from "effect";
import { DateTime } from "luxon";
import { getLoggerFx } from "@/lib/common/log";
import { RateLimitErrorFx } from "~/server/error/RateLimitErrorFx";
import { rateLimitEventFx } from "~/server/rate-limit/server/fx/rateLimitEventFx";
import type { RateLimitRuleEnumSchema } from "~/server/rate-limit/server/schema/RateLimitRuleEnumSchema";

export namespace rateLimitCheckFx {
	export interface Props {
		rule: RateLimitRuleEnumSchema.Type;
		key: string[];
		message?: string;
	}
}

export const rateLimitCheckFx = Effect.fn("rateLimitCheckFx")(function* ({
	rule,
	key,
	message,
}: rateLimitCheckFx.Props) {
	const logger = yield* getLoggerFx("rateLimitCheckFx");
	logger.trace("rateLimitCheckFx", {
		rule,
		key,
	});

	const rateLimitEvent = yield* rateLimitEventFx({
		rule,
		key,
	});

	logger.trace(`Rate limit for [${rule}]`, {
		...rateLimitEvent,
	});

	if (rateLimitEvent.count > rateLimitEvent.limit) {
		const retryAtDateTime = DateTime.fromJSDate(rateLimitEvent.window)
			.plus({
				seconds: rateLimitEvent.seconds,
			})
			.toUTC();
		const retryAt = retryAtDateTime.toISO() ?? retryAtDateTime.toJSDate().toISOString();

		return yield* new RateLimitErrorFx({
			message:
				message ??
				`Rate limit '${rule}' exceeded: ${rateLimitEvent.count}/${rateLimitEvent.limit} in ${rateLimitEvent.seconds}s window`,
			rule,
			limit: rateLimitEvent.limit,
			count: rateLimitEvent.count,
			exceeded: rateLimitEvent.count - rateLimitEvent.limit,
			window: rateLimitEvent.seconds,
			retryAt,
		});
	}

	return rateLimitEvent;
});

export type rateLimitCheckFx = ReturnType<typeof rateLimitCheckFx>;
