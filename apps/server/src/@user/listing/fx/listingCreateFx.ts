import { embedMinHash } from "@use-pico/common/embedding";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DateTime } from "luxon";
import pgvector from "pgvector";
import { match } from "ts-pattern";
import { galleryCreateFx as coolGalleryCreateFx } from "~/@user/gallery/fx/galleryCreateFx";
import { galleryItemCreateFx } from "~/@user/gallery-item/fx/galleryItemCreateFx";
import type { ListingCreateSchema } from "~/@user/listing/schema/ListingCreateSchema";
import { userEventCreateFx } from "~/@user/user-event/fx/userEventCreateFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";
import { listingFetchFx } from "./listingFetchFx";

export namespace listingCreateFx {
	export type Props = ListingCreateSchema.Type;
}

export const listingCreateFx = Effect.fn("listingCreateFx")(function* ({
	uploadIds,
	...data
}: listingCreateFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;
			const user = yield* UserContextFx;

			const id = genId();
			const now = new Date();

			if (uploadIds.length === 0) {
				return yield* new InvalidRequestError({
					message: "At least one upload is required",
				});
			}

			const gallery = yield* coolGalleryCreateFx({
				userId: user.id,
			});

			let sort = 0;
			for (const uploadId of uploadIds) {
				yield* galleryItemCreateFx({
					galleryId: gallery.id,
					uploadId,
					sort,
				});
				sort++;
			}

			yield* Effect.promise(async () => {
				return database
					.insertInto("listing")
					.values({
						id,
						userId: user.id,
						galleryId: gallery.id,
						createdAt: now,
						updatedAt: now,
						currency: "CZK",
						...data,
						titleVec: pgvector.toSql(
							embedMinHash({
								value: data.title,
							}),
						),
						expiresAt: match(data.expiresAt)
							.with("7-days", () =>
								DateTime.now()
									.plus({
										days: 7,
									})
									.toJSDate(),
							)
							.with("14-days", () =>
								DateTime.now()
									.plus({
										days: 14,
									})
									.toJSDate(),
							)
							.with("1-month", () =>
								DateTime.now()
									.plus({
										months: 1,
									})
									.toJSDate(),
							)
							.exhaustive(),
					})
					.execute();
			});

			if (data.draftId) {
				const draftId = data.draftId;
				yield* Effect.promise(async () => {
					return database
						.updateTable("draft")
						.set({
							usedAt: now,
							updatedAt: now,
						})
						.where("id", "=", draftId)
						.where("userId", "=", user.id)
						.execute();
				});
			}

			yield* userEventCreateFx({
				scope: "user",
				source: "listing",
				group: id,
				event: "listing.create",
				isTerminal: true,
			});

			return yield* listingFetchFx({
				where: {
					id,
					withOwn: true,
				},
			});
		}),
	);
});

export type listingCreateFx = ReturnType<typeof listingCreateFx>;
