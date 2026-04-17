import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import { feedFetchFx } from "~/buyer/feed/server/fx/feedFetchFx";
import type { FeedFilterSchema } from "~/buyer/feed/server/schema/FeedFilterSchema";
import type { FeedPatchSchema } from "~/buyer/feed/server/schema/FeedPatchSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { locationFetchFx } from "~/session/location/server/fx/locationFetchFx";

export namespace feedPatchFx {
	export interface Props extends FeedPatchSchema.Type {
		scope: FeedFilterSchema.Type;
	}
}

export const feedPatchFx = Effect.fn("feedPatchFx")(function* ({
	patch,
	query,
	scope,
}: feedPatchFx.Props) {
	const logger = yield* getLoggerFx("feedPatchFx");
	logger.trace("feedPatchFx", {
		patch,
		query,
		scope,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

			const feed = yield* feedFetchFx({
				...query,
				scope,
			});

			if (patch.locationId && !feed.query.meta?.latLon) {
				logger.trace("Binding locationId", {
					locationId: patch.locationId,
				});

				const location = yield* locationFetchFx({
					where: {
						id: patch.locationId,
					},
				});

				patch.query = {
					...patch.query,
					meta: {
						...patch.query?.meta,
						latLon: {
							lat: location.lat,
							lon: location.lon,
						},
					},
				};

				logger.trace("Updated query.meta", {
					query: patch.query,
				});
			}

			if (patch.locationId === null) {
				patch.query = {
					...patch.query,
					meta: {
						...patch.query?.meta,
						latLon: undefined,
					},
				};
			}

			yield* tryDbFx(async () =>
				kysely
					.updateTable("feed")
					.set({
						...patch,
						query: patch.query ? (JSON.stringify(patch.query) as any) : patch.query,
						updatedAt: dateContext.now().toJSDate(),
					})
					.where("id", "=", feed.id)
					.executeTakeFirst(),
			);

			return yield* feedFetchFx({
				where: {
					id: feed.id,
				},
				scope: {},
			});
		}),
	);
});

export type feedPatchFx = ReturnType<typeof feedPatchFx>;
