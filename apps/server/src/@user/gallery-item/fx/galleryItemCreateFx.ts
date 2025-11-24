import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
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
	}
}

export const galleryItemCreateFx = ({ galleryId, uploadId, sort }: galleryItemCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const now = new Date();
		const id = genId();

		const gallery = yield* galleryFetchFx({
			query: {
				where: {
					id: galleryId,
					userId: user.id,
				},
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
					createdAt: now,
				})
				.execute();
		});

		return yield* galleryItemFetchFx({
			query: {
				where: {
					id,
				},
			},
		});
	});
};

export type galleryItemCreateFx = ReturnType<typeof galleryItemCreateFx>;
