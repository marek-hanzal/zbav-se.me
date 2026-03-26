import { DateContextFx } from "@use-pico/common/date";
import { embedMinHash } from "@use-pico/common/embedding";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import pgvector from "pgvector";
import { match } from "ts-pattern";
import { listingFetchFx } from "~/server/@seller/listing/fx/listingFetchFx";
import type { ListingCreateSchema } from "~/server/@seller/listing/schema/ListingCreateSchema";
import { galleryInsertFx } from "~/server/@user/gallery/fx/galleryInsertFx";
import { galleryItemInsertFx } from "~/server/@user/gallery-item/fx/galleryItemInsertFx";
import { userEventCreateFx } from "~/server/@user/user-event/fx/userEventCreateFx";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { InvalidRequestErrorFx } from "~/server/error/InvalidRequestErrorFx";

export namespace listingCreateFx {
	export interface Props extends ListingCreateSchema.Type {
		userId: string;
	}
}

export const listingCreateFx = Effect.fn("listingCreateFx")(function* ({
	userId,
	uploadIds,
	...data
}: listingCreateFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

			const id = genId();
			const now = dateContext.now();

			if (uploadIds.length === 0) {
				return yield* new InvalidRequestErrorFx({
					message: "At least one upload is required",
				});
			}

			const gallery = yield* galleryInsertFx({
				userId,
			});

			let sort = 0;
			for (const uploadId of uploadIds) {
				yield* galleryItemInsertFx({
					galleryId: gallery.id,
					uploadId,
					sort,
					userId,
					check: false,
				});
				sort++;
			}

			yield* tryDbFx(async () =>
				kysely
					.insertInto("listing")
					.values({
						id,
						userId,
						galleryId: gallery.id,
						createdAt: now.toJSDate(),
						updatedAt: now.toJSDate(),
						currency: "CZK",
						status: "live",
						...data,
						titleVec: pgvector.toSql(
							embedMinHash({
								value: data.title,
							}),
						),
						expiresAt: match(data.expiresAt)
							.with("7-days", () =>
								now
									.plus({
										days: 7,
									})
									.toJSDate(),
							)
							.with("14-days", () =>
								now
									.plus({
										days: 14,
									})
									.toJSDate(),
							)
							.with("1-month", () =>
								now
									.plus({
										months: 1,
									})
									.toJSDate(),
							)
							.exhaustive(),
					})
					.execute(),
			);

			if (data.draftId) {
				const draftId = data.draftId;
				yield* tryDbFx(async () =>
					kysely
						.updateTable("draft")
						.set({
							usedAt: now.toJSDate(),
							updatedAt: now.toJSDate(),
						})
						.where("id", "=", draftId)
						.where("userId", "=", userId)
						.execute(),
				);
			}

			yield* userEventCreateFx({
				userId,
				scope: "user",
				source: "listing",
				group: id,
				event: "listing.create",
				isTerminal: true,
			});

			return yield* listingFetchFx({
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

export type listingCreateFx = ReturnType<typeof listingCreateFx>;
