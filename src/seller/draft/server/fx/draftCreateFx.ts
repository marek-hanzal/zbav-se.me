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

export namespace draftCreateFx {
	export interface Props extends DraftCreateSchema.Type {
		userId: string;
	}
}

export const draftCreateFx = Effect.fn("draftCreateFx")(function* ({
	userId,
	...data
}: draftCreateFx.Props) {
	const logger = yield* getLoggerFx("draftCreateFx");
	logger.trace("draftCreateFx", {
		userId,
		...data,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

			const id = genId();
			const now = dateContext.now();

			const gallery = yield* galleryInsertFx({
				access: "public",
				userId,
			});

			yield* tryDbFx(async () => {
				return kysely
					.insertInto("draft")
					.values({
						...data,
						id,
						userId,
						//
						galleryId: gallery.id,
						withImageUrl: [],
						withUploadIds: [],
						//
						delivery: [],
						//
						cons: [],
						pros: [],
						//
						createdAt: now.toJSDate(),
						updatedAt: now.toJSDate(),
					})
					.execute();
			});

			return yield* draftFetchFx({
				userId,
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
