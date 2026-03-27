import { createServerFn } from "@tanstack/react-start";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { z } from "zod";
import { FeedQuerySchema } from "~/buyer/feed/server/schema/FeedQuerySchema";
import { feedFavouriteCollectionFx } from "~/buyer/feed-favourite/server/fx/feedFavouriteCollectionFx";
import { FeedFavouriteSchema } from "~/buyer/feed-favourite/server/schema/FeedFavouriteSchema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const feedFavouriteCollectionFn = createServerFn()
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(FeedQuerySchema)
	.handler(async ({ data, context: { database, user } }) =>
		zodGuardFx({
			schema: z.array(FeedFavouriteSchema),
			dataFx: feedFavouriteCollectionFx({
				...data,
				userId: user.id,
				scope: {
					userId: user.id,
				},
			}),
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
