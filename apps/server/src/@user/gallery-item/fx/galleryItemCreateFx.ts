import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { galleryFetchFx } from "~/@user/gallery/fx/galleryFetchFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";
import { NotFoundError } from "~/error/NotFoundError";
import { galleryItemFetchFx } from "./galleryItemFetchFx";

export namespace galleryItemCreateFx {
	export interface Props {
		galleryId: string;
		uploadIds: string[];
	}
}

export const galleryItemCreateFx = ({ galleryId, uploadIds }: galleryItemCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		if (uploadIds.length === 0) {
			return yield* new InvalidRequestError({
				message: "At least one upload is required",
			});
		}

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
				.values(
					uploadIds.map((uploadId, index) => ({
						id,
						galleryId,
						uploadId,
						sort: index,
						createdAt: now,
					})),
				)
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
