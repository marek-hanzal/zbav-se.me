import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { galleryFetchFx } from "~/@user/gallery/fx/galleryFetchFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";
import { galleryItemFetchFx } from "./galleryItemFetchFx";

export namespace galleryItemCreateFx {
	export interface Props {
		galleryId: string;
		uploadId: string;
		sort: number;
		createdAt?: DateTime;
	}
}

export const galleryItemCreateFx = ({
	galleryId,
	uploadId,
	sort,
	createdAt,
}: galleryItemCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const now = createdAt ?? DateTime.now();
		const id = genId();

		const gallery = yield* galleryFetchFx({
			where: {
				id: galleryId,
				userId: user.id,
			},
		});

		if (!gallery) {
			return yield* new NotFoundError({
				resource: "gallery",
				resourceId: galleryId,
				message: "Gallery not found",
			});
		}

		yield* Effect.tryPromise(async () => {
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
		});
	});
};

export type galleryItemCreateFx = ReturnType<typeof galleryItemCreateFx>;
