import { rangedom, sample } from "@use-pico/common/rangedom";
import { Effect } from "effect";
import { galleryCreateFx } from "~/@user/gallery/fx/galleryCreateFx";
import { galleryItemCreateFx } from "~/@user/gallery-item/fx/galleryItemCreateFx";
import { SeedProgressContextFx } from "~/seed/context/SeedProgressContextFx";
import { withSeedConcurrency } from "~/seed/fx/core/seedConcurrency";

const GALLERY_SEED_CONCURRENCY = withSeedConcurrency("SEED_GALLERY_CONCURRENCY");

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

	const maxItemsPerGallery = Math.min(6, uploadIds.length);
	const galleryItemPlan = Array.from({
		length: galleryDeficit,
	}).map(() => 0);

	if (galleryItemDeficit > 0 && maxItemsPerGallery > 0) {
		let remaining = galleryItemDeficit;
		let index = 0;
		while (remaining > 0) {
			if (index >= galleryItemPlan.length) {
				index = 0;
			}
			if (galleryItemPlan[index] === undefined) {
				break;
			}
			const current = galleryItemPlan[index];
			if (current === undefined) {
				break;
			}
			if (current < maxItemsPerGallery) {
				galleryItemPlan[index] = current + 1;
				remaining -= 1;
			}
			index += 1;
			if (galleryItemPlan.every((item) => item >= maxItemsPerGallery)) {
				break;
			}
		}
	}

	let createdItems = 0;
	yield* Effect.forEach(
		Array.from({
			length: galleryDeficit,
		}).map((_, i) => i),
		(i) =>
			Effect.gen(function* () {
				const gallery = yield* galleryCreateFx({
					userId,
				});

				const planned = galleryItemPlan[i] ?? 0;
				const requested =
					galleryItemDeficit > 0 ? planned : rangedom(1, Math.min(6, uploadIds.length));
				const uploads = sample(uploadIds, requested);
				let sort = 0;
				let localCreated = 0;
				for (const uploadId of uploads) {
					yield* galleryItemCreateFx({
						userId,
						galleryId: gallery.id,
						uploadId,
						sort,
					});
					sort += 1;
					localCreated += 1;
				}

				yield* progress.advance({
					delta: 1,
				});

				return localCreated;
			}),
		{
			concurrency: GALLERY_SEED_CONCURRENCY,
		},
	).pipe(
		Effect.map((counts) => {
			createdItems = counts.reduce((acc, value) => acc + value, 0);
		}),
	);

	yield* progress.log({
		message: `Gallery generation done (gallery=${galleryDeficit}, gallery_item=${createdItems})`,
	});
});

export type seedCoreGalleryFx = ReturnType<typeof seedCoreGalleryFx>;
