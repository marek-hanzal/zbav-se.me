import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { draftFetchFx } from "~/seller/draft/server/fx/draftFetchFx";
import type { DraftCreateSchema } from "~/seller/draft/server/schema/DraftCreateSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { galleryInsertFx } from "~/user/gallery/server/fx/galleryInsertFx";
import { galleryItemInsertFx } from "~/user/gallery-item/server/fx/galleryItemInsertFx";

export namespace draftCreateFx {
	export interface Props extends DraftCreateSchema.Type {
		userId: string;
	}
}

export const draftCreateFx = Effect.fn("draftCreateFx")(function* ({
	userId,
	uploadIds = [],
	...data
}: draftCreateFx.Props) {
	const logger = yield* getLoggerFx("draftCreateFx");
	logger.trace("draftCreateFx", {
		userId,
		uploadIds,
		...data,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

			const id = genId();
			const now = dateContext.now().toJSDate();

			const gallery = yield* galleryInsertFx({
				access: "private",
				userId,
			});

			if (uploadIds && uploadIds.length > 0) {
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
			}

			let withImageUrl: string[] = [];
			let withUploadIds: string[] = [];
			if (uploadIds && uploadIds.length > 0) {
				const withUpload = yield* tryDbFx(async () => {
					return kysely
						.selectFrom("upload")
						.select([
							"id",
							"url",
						])
						.where("userId", "=", userId)
						.where("id", "in", uploadIds)
						.execute();
				});

				const urlById = new Map(
					withUpload.map((row) => [
						row.id,
						row.url,
					]),
				);

				withImageUrl = uploadIds.flatMap((uploadId) => {
					const imageUrl = urlById.get(uploadId);
					return imageUrl
						? [
								imageUrl,
							]
						: [];
				});
				withUploadIds = uploadIds.filter((uploadId) => urlById.has(uploadId));
			}

			yield* tryDbFx(async () => {
				return kysely
					.insertInto("draft")
					.values({
						...data,
						userId,
						id,
						galleryId: gallery.id,
						createdAt: now,
						updatedAt: now,
						currency: "CZK",
						withImageUrl,
						withUploadIds,
					})
					.execute();
			});

			return yield* draftFetchFx({
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

export type draftCreateFx = ReturnType<typeof draftCreateFx>;
