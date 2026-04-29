import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import type { ListingPatchSchema } from "../schema/ListingPatchSchema";
import type { ListingWhereSchema } from "../schema/ListingWhereSchema";
import { listingFetchFx } from "./listingFetchFx";

export namespace listingPatchFx {
	export interface Props extends ListingPatchSchema.Type {
		scope: ListingWhereSchema.Type;
	}
}

export const listingPatchFx = Effect.fn("listingPatchFx")(function* ({
	patch: { locationId, ...patch },
	query,
	scope,
}: listingPatchFx.Props) {
	const logger = yield* getLoggerFx("listingPatchFx");
	logger.trace("listingPatchFx", {
		patch: {
			...patch,
			locationId,
		},
		query,
		scope,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;

			const listing = yield* listingFetchFx({
				...query,
				scope,
			});

			logger.trace("listing", {
				listingId: listing.id,
			});

			yield* tryDbFx(async () => {
				return kysely
					.updateTable("listing")
					.set({
						...patch,
						locationId,
					})
					.where("id", "=", listing.id)
					.execute();
			});

			logger.trace("patched", {
				listingId: listing.id,
			});

			if (patch.priceType === "offer") {
				patch.price = null;
			}

			if (locationId) {
				const { geo: withLocation } = yield* tryDbFx(async () => {
					return kysely
						.selectFrom("location")
						.select("geo")
						.where("id", "=", locationId)
						.executeTakeFirstOrThrow();
				});

				yield* tryDbFx(async () => {
					return kysely
						.updateTable("listing")
						.set({
							withLocation,
						})
						.where("id", "=", listing.id)
						.execute();
				});

				logger.trace("locationId", {
					listingId: listing.id,
					locationId,
					withLocation,
				});
			}

			return yield* listingFetchFx({
				where: {
					id: listing.id,
				},
				scope: {},
			});
		}),
	);
});

export type listingPatchFx = ReturnType<typeof listingPatchFx>;
