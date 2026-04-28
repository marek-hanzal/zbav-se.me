import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { listingFetchFx } from "~/seller/listing/server/fx/listingFetchFx";
import type { ListingCreateSchema } from "~/seller/listing/server/schema/ListingCreateSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { galleryInsertFx } from "~/user/gallery/server/fx/galleryInsertFx";
import { userEventCreateFx } from "~/user/user-event/server/fx/userEventCreateFx";

export namespace listingCreateFx {
	export type Props = ListingCreateSchema.Type & {
		userId: string;
	};
}

export const listingCreateFx = Effect.fn("listingCreateFx")(function* ({
	userId,
	...data
}: listingCreateFx.Props) {
	const logger = yield* getLoggerFx("listingCreateFx");
	logger.trace("listingCreateFx", {
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

			yield* tryDbFx(async () =>
				kysely
					.insertInto("listing")
					.values({
						...data,
						id,
						userId,
						//
						galleryId: gallery.id,
						withImageUrl: [],
						withUploadIds: [],
						//
						status: "draft",
						//
						createdAt: now.toJSDate(),
						updatedAt: now.toJSDate(),
					})
					.execute(),
			);

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
