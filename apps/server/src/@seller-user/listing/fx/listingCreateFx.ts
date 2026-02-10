import { DateContextFx } from "@use-pico/common/date";
import { embedMinHash } from "@use-pico/common/embedding";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import pgvector from "pgvector";
import { match } from "ts-pattern";
import { listingFetchFx } from "~/@seller-user/listing/fx/listingFetchFx";
import type { ListingCreateSchema } from "~/@seller-user/listing/schema/ListingCreateSchema";
import { galleryCreateFx as coolGalleryCreateFx } from "~/@user/gallery/fx/galleryCreateFx";
import { galleryItemCreateFx } from "~/@user/gallery-item/fx/galleryItemCreateFx";
import { userEventCreateFx } from "~/@user/user-event/fx/userEventCreateFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { withTraceFx } from "~/effect/withTraceFx";
import { InvalidRequestErrorFx } from "~/error/InvalidRequestErrorFx";

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
	yield* withTraceFx({
		fx: "listingCreateFx",
		input: {
			userId,
			uploadIds,
			...data,
		},
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

			const id = genId();
			const now = dateContext.now();

			if (uploadIds.length === 0) {
				yield* withTraceFx({
					fx: "listingCreateFx",
					error: {
						message: "At least one upload is required",
					},
				});
				return yield* new InvalidRequestErrorFx({
					message: "At least one upload is required",
				});
			}

			const gallery = yield* coolGalleryCreateFx({
				userId,
			});

			let sort = 0;
			for (const uploadId of uploadIds) {
				yield* galleryItemCreateFx({
					galleryId: gallery.id,
					uploadId,
					sort,
					userId,
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
