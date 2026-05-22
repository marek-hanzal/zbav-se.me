import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { NotFoundErrorFx } from "@/lib/common/error";
import { getLoggerFx } from "@/lib/common/log";
import { hash } from "@/lib/server/hmac";
import { RateLimitRuleTableSchema } from "~/server/database/@table/RateLimitRuleTableSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { ServerHmacSchema } from "~/server/env/ServerHmacSchema";
import type { RateLimitQuerySchema } from "~/server/rate-limit/server/schema/RateLimitQuerySchema";
import { getWindowFx } from "./getWindowFx";

export namespace rateLimitFx {
	export interface Props extends RateLimitQuerySchema.Type {
		//
	}
}

/**
 * Returns current snapshot (info) of rate limit
 */
export const rateLimitFx = Effect.fn("rateLimitFx")(function* ({ rule, key }: rateLimitFx.Props) {
	const logger = yield* getLoggerFx("rateLimitFx");
	logger.trace("rateLimitFx", {
		rule,
		key,
	});

	const dateContext = yield* DateContextFx;
	const hmacConfig = ServerHmacSchema.parse(process.env);

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;

			const rateLimitRuleRow = yield* tryDbFx(async () => {
				return kysely
					.selectFrom("rate_limit_rule")
					.select([
						"window",
						"limit",
					])
					.where("name", "=", rule)
					.executeTakeFirst();
			});

			if (!rateLimitRuleRow) {
				logger.trace(`Rate limit rule '${rule}' was not found`, {
					rule,
				});

				return yield* new NotFoundErrorFx({
					resource: "rate-limit-rule",
					resourceId: rule,
					message: `Rate limit rule '${rule}' was not found`,
				});
			}

			const rateLimitRule = RateLimitRuleTableSchema.pick({
				window: true,
				limit: true,
			}).parse(rateLimitRuleRow);

			const hashedKey = hash({
				key,
				secret: hmacConfig.SERVER_HMAC_SECRET,
			});

			const now = dateContext.now();

			const window = yield* getWindowFx({
				now,
				seconds: rateLimitRule.window,
			});

			const current = yield* tryDbFx(async () => {
				return kysely
					.selectFrom("rate_limit_event as rle")
					.select([
						"rle.count",
					])
					.where("rle.rule", "=", rule)
					.where("rle.key", "=", hashedKey)
					.where("rle.window", "=", window.toJSDate())
					.executeTakeFirst();
			});
			const count = current?.count ?? 0;

			return {
				rule,
				key: hashedKey,
				window: window.toJSDate(),
				count,
				limit: rateLimitRule.limit,
				seconds: rateLimitRule.window,
			} as const;
		}),
	);
});

export type rateLimitFx = ReturnType<typeof rateLimitFx>;
