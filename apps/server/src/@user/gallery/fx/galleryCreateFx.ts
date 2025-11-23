import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { galleryFetchFx } from "~/@user/gallery/fx/galleryFetchFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export const galleryCreateFx = () => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const id = genId();

		yield* Effect.tryPromise(async () => {
			return database
				.insertInto("gallery")
				.values({
					id,
					userId: user.id,
					createdAt: new Date(),
				})
				.execute();
		});

		return yield* galleryFetchFx({
			query: {
				where: {
					id,
				},
			},
		});
	});
};

export type galleryCreateFx = ReturnType<typeof galleryCreateFx>;
