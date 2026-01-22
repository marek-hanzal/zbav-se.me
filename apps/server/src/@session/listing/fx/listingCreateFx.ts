import { DateContextFx } from "@use-pico/common/date";
import { embedMinHash } from "@use-pico/common/embedding";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import pgvector from "pgvector";
import { match } from "ts-pattern";
import { galleryCreateFx as coolGalleryCreateFx } from "~/app/gallery/fx/galleryCreateFx";
import { galleryItemCreateFx } from "~/app/gallery-item/fx/galleryItemCreateFx";
import { userEventCreateFx } from "~/app/user-event/fx/userEventCreateFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";
import type { ListingCreateSchema } from "../schema/ListingCreateSchema";
import { listingFetchFx } from "./listingFetchFx";

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
				return kysely
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
					.execute();
			});

			if (data.draftId) {
				const draftId = data.draftId;
				yield* Effect.promise(async () => {
					return kysely
						.updateTable("draft")
						.set({
							usedAt: now.toJSDate(),
							updatedAt: now.toJSDate(),
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
