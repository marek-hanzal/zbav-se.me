import { createMiddleware } from "@tanstack/react-start";
import { Effect } from "effect";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withDateServiceFx } from "~/date/fx/withDateServiceFx";
import { withLoggerFx } from "~/log/fx/withLoggerFx";
import type { NoticeSchema } from "~/notice/schema/NoticeSchema";
import { rateLimitCheckFx } from "~/rate-limit/fx/rateLimitCheckFx";
import type { RateLimitRuleEnumSchema } from "~/rate-limit/schema/RateLimitRuleEnumSchema";
import { toRequestSource } from "~/request-middleware/fn/toRequestSource";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { RateLimitErrorFx } from "~/server-error/error/RateLimitErrorFx";

export namespace withRateLimitMiddleware {
	export interface Props {
		rule: RateLimitRuleEnumSchema.Type;
		key: string[];
		message: string;
	}
}

export const withRateLimitMiddleware = ({ rule, key, message }: withRateLimitMiddleware.Props) => {
	return createMiddleware()
		.middleware([
			withDatabaseMiddleware,
			withLogMiddleware,
		])
		.server(async ({ request, next, context: { database, rootLogger } }) => {
			const source = toRequestSource(request.headers);

			const result = await rateLimitCheckFx({
				rule,
				key: [
					source,
					...key,
				],
				message,
			}).pipe(
				withKyselyFx(database),
				withDateServiceFx(),
				withLoggerFx(rootLogger),
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

			return next();
		});
};
