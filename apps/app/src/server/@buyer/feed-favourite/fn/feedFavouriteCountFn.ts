import { createServerFn } from "@tanstack/react-start";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { CountSchema } from "~/common/schema/CountSchema";
import { feedFavouriteCountFx } from "~/server/@buyer/feed-favourite/fx/feedFavouriteCountFx";
import { FeedFavouriteCountQuerySchema } from "~/server/@buyer/feed-favourite/schema/FeedFavouriteCountQuerySchema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const feedFavouriteCountFn = createServerFn()
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(FeedFavouriteCountQuerySchema)
	.handler(async ({ data, context: { database, user } }) =>
		Effect.gen(function* () {
			return yield* zodGuardFx({
				schema: CountSchema,
				dataFx: feedFavouriteCountFx({
					...data,
					userId: user.id,
					scope: {
						userId: user.id,
					},
				}),
			});
		}).pipe(
			withKyselyFx(database),
			withCatchFx({
				ZodErrorFx() {
					throw new Error("ZodError");
				},
			}),
			Effect.runPromise,
		),
	);
