import { rangedom, sample } from "@use-pico/common/rangedom";
import { Effect } from "effect";
import { galleryCreateFx } from "~/@user/gallery/fx/galleryCreateFx";
import { galleryItemCreateFx } from "~/@user/gallery-item/fx/galleryItemCreateFx";
import { SeedProgressContextFx } from "~/seed/context/SeedProgressContextFx";

export const seedCoreGalleryFx = Effect.fn("seedCoreGalleryFx")(function* ({
	userId,
	uploadIds,
	galleryDeficit,
	galleryItemDeficit,
}: {
	userId: string;
	uploadIds: string[];
	galleryDeficit: number;
	galleryItemDeficit: number;
}) {
	const progress = yield* SeedProgressContextFx;
	if (galleryDeficit <= 0 || uploadIds.length === 0) {
		return;
	}

	let createdItems = 0;
	for (let i = 0; i < galleryDeficit; i++) {
		const gallery = yield* galleryCreateFx({
			userId,
		});

		const requested = rangedom(1, Math.min(6, uploadIds.length));
		const uploads = sample(uploadIds, requested);
		let sort = 0;
		for (const uploadId of uploads) {
			if (createdItems >= galleryItemDeficit && galleryItemDeficit > 0) {
				break;
			}
			yield* galleryItemCreateFx({
				userId,
				galleryId: gallery.id,
				uploadId,
				sort,
			});
			sort += 1;
			createdItems += 1;
		}

		yield* progress.advance({
			delta: 1,
		});
	}

	yield* progress.log({
		message: `Gallery generation done (gallery=${galleryDeficit}, gallery_item=${createdItems})`,
	});
});

export type seedCoreGalleryFx = ReturnType<typeof seedCoreGalleryFx>;
