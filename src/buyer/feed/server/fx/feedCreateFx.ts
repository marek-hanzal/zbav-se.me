import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { feedFetchFx } from "~/buyer/feed/server/fx/feedFetchFx";
import type { FeedCreateSchema } from "~/buyer/feed/server/schema/FeedCreateSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { ConflictErrorFx } from "~/server/error/ConflictErrorFx";
import { locationFetchFx } from "~/session/location/server/fx/locationFetchFx";

export namespace feedCreateFx {
	export interface Props extends FeedCreateSchema.Type {
		userId: string;
	}
}

export const feedCreateFx = Effect.fn("feedCreateFx")(function* ({
	userId,
	query,
	...data
}: feedCreateFx.Props) {
	const logger = yield* getLoggerFx("feedCreateFx");
	logger.trace("feedCreateFx", {
		userId,
		query,
		...data,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

			const id = genId();
			const now = dateContext.now();

			if (data.locationId && !query.meta?.latLon) {
				logger.debug("Binding locationId", {
					locationId: data.locationId,
				});

				const location = yield* locationFetchFx({
					where: {
						id: data.locationId,
					},
				});

				query.meta = {
					...query.meta,
					latLon: {
						lat: location.lat,
						lon: location.lon,
					},
				};

				logger.debug("Updated query.meta", {
					query,
				});
			}

			yield* tryDbFx(
				async () =>
					kysely
						.insertInto("feed")
						.values({
							...data,
							id,
							userId,
							uploadId: null,
							query: JSON.stringify(query) as any,
							createdAt: now.toJSDate(),
							updatedAt: now.toJSDate(),
						})
						.executeTakeFirstOrThrow(),
				{
					"23505": (e) =>
						new ConflictErrorFx({
							message: "Feed already exists",
							cause: e,
						}),
				},
			);

			return yield* feedFetchFx({
				where: {
					id,
				},
				scope: {
					userId,
				},
			});
		}),
	);
});

export type feedCreateFx = ReturnType<typeof feedCreateFx>;
