import { Effect } from "effect";
import { sql } from "kysely";
import type { DateTime } from "luxon";
import { DateContextFx } from "@/lib/common/date";
import { NotFoundErrorFx } from "@/lib/common/error";
import { getLoggerFx } from "@/lib/common/log";
import { hash } from "@/lib/server/hmac";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { ServerHmacSchema } from "~/server/env/ServerHmacSchema";

function toRateLimitWindowStart(now: DateTime, windowSeconds: number) {
	const elapsedSeconds = Math.floor(now.toSeconds()) % windowSeconds;

	return now
		.minus({
			seconds: elapsedSeconds,
		})
		.startOf("second")
		.toJSDate();
}

export namespace rateLimitEventFx {
	export interface Props {
		rule: string;
		key: string[];
	}
}

export const rateLimitEventFx = Effect.fn("rateLimitEventFx")(function* ({
	rule,
	key,
}: rateLimitEventFx.Props) {
	const logger = yield* getLoggerFx("rateLimitEventFx");
	logger.trace("rateLimitEventFx", {
		rule,
		key,
	});

	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;
	const hmacConfig = ServerHmacSchema.parse(process.env);

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const rateLimitRule = yield* tryDbFx(async () => {
				return kysely
					.selectFrom("rate_limit_rule")
					.select([
						"window",
						"limit",
					])
					.where("name", "=", rule)
					.executeTakeFirst();
			});

			if (!rateLimitRule) {
				return yield* new NotFoundErrorFx({
					resource: "rate-limit-rule",
					resourceId: rule,
					message: `Rate limit rule '${rule}' was not found`,
				});
			}

			const hashedKey = hash({
				key,
				secret: hmacConfig.SERVER_HMAC_SECRET,
			});
			const now = dateContext.now();

			const window = toRateLimitWindowStart(now, rateLimitRule.window);

			const event = yield* tryDbFx(async () => {
				return kysely
					.insertInto("rate_limit_event")
					.values({
						rule,
						key: hashedKey,
						window,
						count: 1,
					})
					.onConflict((oc) => {
						return oc
							.columns([
								"rule",
								"key",
								"window",
							])
							.doUpdateSet({
								count: sql`rate_limit_event.count + 1`,
							});
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});

			return {
				...event,
				limit: rateLimitRule.limit,
				seconds: rateLimitRule.window,
			} as const;
		}),
	);
});

export type rateLimitEventFx = ReturnType<typeof rateLimitEventFx>;
