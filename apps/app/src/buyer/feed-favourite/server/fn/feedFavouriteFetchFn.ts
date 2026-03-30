import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/schema";
import { FeedQuerySchema } from "~/buyer/feed/server/schema/FeedQuerySchema";
import { feedFavouriteFetchFx } from "~/buyer/feed-favourite/server/fx/feedFavouriteFetchFx";
import { FeedFavouriteSchema } from "~/buyer/feed-favourite/server/schema/FeedFavouriteSchema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const feedFavouriteFetchFn = createServerFn()
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(FeedQuerySchema)
	.handler(async ({ data, context: { database, user } }) =>
		zodGuardFx({
			schema: FeedFavouriteSchema,
			dataFx: feedFavouriteFetchFx({
				...data,
				userId: user.id,
				scope: {
					userId: user.id,
				},
			}),
		}).pipe(
			withKyselyFx(database),
			withCatchFx({
				NotFoundErrorFx() {
					throw new Error("NotFoundError");
				},
				ZodErrorFx() {
					throw new Error("ZodError");
				},
			}),
			Effect.runPromise,
		),
	);
