import { createMiddleware } from "@tanstack/react-start";
import { Effect } from "effect";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import type { NoticeSchema } from "~/notice/schema/NoticeSchema";
import { rateLimitCheckFx } from "~/rate-limit/fx/rateLimitCheckFx";
import type { RateLimitRuleEnumSchema } from "~/rate-limit/schema/RateLimitRuleEnumSchema";
import { toRequestSourceFn } from "~/request-middleware/fn/toRequestSourceFn";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { RateLimitErrorFx } from "~/server-error/error/RateLimitErrorFx";

export namespace withRateLimitMiddlewareFn {
	export interface Props {
		rule: RateLimitRuleEnumSchema.Type;
		key: string[];
		message: string;
	}
}

export const withRateLimitMiddlewareFn = ({
	rule,
	key,
	message,
}: withRateLimitMiddlewareFn.Props) => {
	return createMiddleware()
		.middleware([
			withDatabaseMiddleware,
			withLogMiddleware,
		])
		.server(async ({ request, next: nextFn, context: { database, rootLogger } }) => {
			const source = toRequestSourceFn(request.headers);

			const result = await rateLimitCheckFx({
				rule,
				key: [
					source,
					...key,
				],
				message,
			}).pipe(
				withKyselyFn(database),
				withDateServiceFn(),
				withLoggerFn(rootLogger),
				Effect.as(undefined),
				Effect.catchTag("RateLimitErrorFx", (error) => Effect.succeed(error)),
				Effect.runPromise,
			);

			if (result instanceof RateLimitErrorFx) {
				return Response.json(
					{
						type: "error",
						message,
					} satisfies NoticeSchema.Type,
					{
						status: 429,
						statusText: "Don't hurry, bro, we've time",
						headers: {
							"Retry-After": String(result.window),
						},
					},
				);
			}

			return nextFn();
		});
};
