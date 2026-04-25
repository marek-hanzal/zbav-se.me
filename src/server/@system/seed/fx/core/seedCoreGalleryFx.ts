import { Effect } from "effect";
import { rangedom, sample } from "@/lib/common/rangedom";
import { SeedProgressContextFx } from "~/server/@system/seed/context/withSeedProgressFx";
import { withSeedConcurrency } from "~/server/@system/seed/fx/core/seedConcurrency";
import { seedGalleryItemBulkInsertFx } from "~/server/@system/seed/fx/core/seedGalleryItemBulkInsertFx";
import { withRandomPastDate } from "~/server/@system/seed/fx/time/seedTime";
import { withSeedNowFx } from "~/server/@system/seed/fx/time/withSeedNowFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { galleryInsertFx } from "~/user/gallery/server/fx/galleryInsertFx";

const GALLERY_SEED_CONCURRENCY = withSeedConcurrency("SEED_GALLERY_CONCURRENCY");
const GALLERY_TX_CHUNK_SIZE = 25;

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
		const plannedTotal = Math.min(galleryItemDeficit, galleryDeficit * maxItemsPerGallery);
		const base = Math.floor(plannedTotal / galleryDeficit);
		const remainder = plannedTotal % galleryDeficit;
		for (let i = 0; i < galleryDeficit; i++) {
			galleryItemPlan[i] = base + (i < remainder ? 1 : 0);
		}
	}

	let createdItems = 0;
	const indices = Array.from({
		length: galleryDeficit,
	}).map((_, i) => i);
	const chunks: number[][] = [];
	for (let i = 0; i < indices.length; i += GALLERY_TX_CHUNK_SIZE) {
		chunks.push(indices.slice(i, i + GALLERY_TX_CHUNK_SIZE));
	}

	yield* Effect.forEach(
		chunks,
		(chunk) =>
			withTransactionFx(
				Effect.gen(function* () {
					const counts = yield* Effect.forEach(chunk, (i) =>
						Effect.gen(function* () {
							const seededAt = withRandomPastDate();
							const gallery = yield* galleryInsertFx({
								access: "private",
								userId,
							}).pipe(withSeedNowFx(seededAt));

							const planned = galleryItemPlan[i] ?? 0;
							const requested =
								galleryItemDeficit > 0
									? planned
									: rangedom(1, Math.min(6, uploadIds.length));
							const uploads = sample(uploadIds, requested);
							const localCreated = yield* seedGalleryItemBulkInsertFx({
								galleryId: gallery.id,
								uploadIds: uploads,
							}).pipe(withSeedNowFx(seededAt));
							return localCreated;
						}),
					);
					yield* progress.advance({
						delta: chunk.length,
					});
					return counts.reduce((acc, value) => acc + value, 0);
				}),
			),
		{
			concurrency: GALLERY_SEED_CONCURRENCY,
		},
	).pipe(
		Effect.map((counts) => {
			createdItems = counts.reduce((acc, value) => acc + value, 0);
			return counts;
		}),
	);

	yield* progress.log({
		message: `Gallery generation done (gallery=${galleryDeficit}, gallery_item=${createdItems})`,
	});
});

export type seedCoreGalleryFx = ReturnType<typeof seedCoreGalleryFx>;
