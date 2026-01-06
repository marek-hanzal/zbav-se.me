import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { galleryFetchFx } from "~/@user/gallery/fx/galleryFetchFx";
import { galleryItemFetchFx } from "~/app/gallery-item/fx/galleryItemFetchFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace galleryItemCreateFx {
	export interface Props {
		galleryId: string;
		uploadId: string;
		sort: number;
		createdAt?: DateTime;
	}
}

export const galleryItemCreateFx = Effect.fn("galleryItemCreateFx")(function* ({
	galleryId,
	uploadId,
	sort,
	createdAt,
}: galleryItemCreateFx.Props) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	const now = createdAt ?? DateTime.now();
	const id = genId();

	/**
	 * Just ensures the gallery exists with the correct user
	 */
	yield* galleryFetchFx({
		where: {
			id: galleryId,
			userId: user.id,
		},
	});

	yield* Effect.promise(async () => {
		return database
			.insertInto("gallery_item")
			.values({
				id,
				galleryId,
				uploadId,
				sort,
				createdAt: now.toJSDate(),
			})
			.execute();
	});

	return yield* galleryItemFetchFx({
		where: {
			id,
		},
		scope: {},
	});
});

export type galleryItemCreateFx = ReturnType<typeof galleryItemCreateFx>;
