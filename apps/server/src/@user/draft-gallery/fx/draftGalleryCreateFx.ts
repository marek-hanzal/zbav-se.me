import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace draftGalleryCreateFx {
	export interface Props {
		draftId: string;
		galleryId: string;
	}
}

export const draftGalleryCreateFx = ({ draftId, galleryId }: draftGalleryCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const id = genId();

		yield* Effect.tryPromise(async () => {
			return database
				.insertInto("draft_gallery")
				.values({
					id,
					draftId,
					galleryId,
					createdAt: new Date(),
				})
				.execute();
		});

		return id;
	});
};

export type draftGalleryCreateFx = ReturnType<typeof draftGalleryCreateFx>;
