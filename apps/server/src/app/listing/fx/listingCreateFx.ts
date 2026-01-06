import { embedMinHash } from "@use-pico/common/embedding";
import { genId } from "@use-pico/common/gen-id";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { DateTime } from "luxon";
import pgvector from "pgvector";
import { match } from "ts-pattern";
import type { ListingCreateSchema } from "~/@user/listing/schema/ListingCreateSchema";
import { userEventCreateFx } from "~/@user/user-event/fx/userEventCreateFx";
import { galleryCreateFx as coolGalleryCreateFx } from "~/app/gallery/fx/galleryCreateFx";
import { galleryItemCreateFx } from "~/app/gallery-item/fx/galleryItemCreateFx";
import { listingFetchFx } from "~/app/listing/fx/listingFetchFx";
import type { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";

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
			const database = yield* DatabaseContextFx;

			const id = genId();
			const now = new Date();

			if (uploadIds.length === 0) {
				return yield* new InvalidRequestError({
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

			yield* Effect.promise(async () => {
				return database
					.insertInto("listing")
					.values({
						id,
						userId,
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
						.where("userId", "=", userId)
						.execute();
				});
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
				userId,
				where: {
					id,
					withOwn: true,
				},
				scope: {
					userId,
				},
			});
		}),
	);
});

export type listingCreateFx = ReturnType<typeof listingCreateFx>;

type _NoUser = AssertNever<Extract<Effect.Effect.Context<listingCreateFx>, UserContextFx>>;
