import { Effect } from "effect";
import type { SeedRunSummary } from "~/seed/seed/SeedRunSummary";
import ListingCategorySeedData from "~/server/@system/seed/data/listing-category-seed.json" with {
	type: "json",
};
import LocationQueries from "~/server/@system/seed/data/location.json" with { type: "json" };
import type { CategoryTableSchema } from "~/server/database/@table/CategoryTableSchema";
import { dbFx } from "~/server/database/fx/dbFx";
import { RuntimeErrorFx } from "~/server/error/RuntimeErrorFx";
import { locationAutocompleteFx } from "~/session/location/server/fx/locationAutocompleteFx";
import { categoryAttrOfFx } from "~/user/category/server/fx/categoryAttrOfFx";
import { ensureSeedUploadPoolFx } from "./ensureSeedUploadPoolFx";
import { ensureSeedUserFx } from "./ensureSeedUserFx";
import {
	createListingSeedBatchStoreFx,
	readListingSeedBatchFx,
	removeListingSeedBatchFx,
	removeListingSeedBatchStoreFx,
	writeListingSeedBatchFx,
} from "./listingSeedBatchStoreFx";
import {
	buildSeedListingPlansFx,
	type SeedBranchRecord,
	type SeedResolvedUpload,
} from "./listingSeedPlanFx";
import { listingSeedPublishFx } from "./listingSeedPublishFx";
import { SeedProgressContextFx } from "./SeedProgressContextFx";

const CREATE_PROGRESS_INTERVAL = 1000;
const PUBLISH_PLAN_BATCH_SIZE = 1000;
const LOCATION_QUERY_POOL = LocationQueries as string[];

type SeedDataset = Record<string, SeedBranchRecord[]>;
type CategoryAttrMeta = {
	kind: string;
};

const seedDataset = ListingCategorySeedData as SeedDataset;

const withShuffle = <T>(items: readonly T[]) => {
	const next = items.slice();

	for (let index = next.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(Math.random() * (index + 1));
		const current = next[index];
		const swap = next[swapIndex];

		if (current === undefined || swap === undefined) {
			continue;
		}

		next[index] = swap;
		next[swapIndex] = current;
	}

	return next;
};

const toSeedBranch = (slug: string) => {
	return seedDataset[slug] ?? seedDataset.default ?? [];
};

const withListingTotalFx = Effect.fn("withListingTotalFx")(function* () {
	const row = yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("listing")
			.select((eb) => eb.fn.countAll<string>().as("count"))
			.executeTakeFirstOrThrow();
	});

	return Number(row.count);
});

const withSupportedCategoriesFx = Effect.fn("withSupportedCategoriesFx")(function* () {
	const categories = yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("category")
			.selectAll()
			.where("locale", "=", "cs")
			.orderBy("sort", "asc")
			.execute();
	});

	const supported: CategoryTableSchema.Type[] = [];

	for (const category of categories) {
		const attrs = (yield* categoryAttrOfFx({
			categoryId: category.id,
		})) as unknown as Array<CategoryAttrMeta>;
		const hasRequiredAttrs = attrs.some((attr) => attr.kind === "required");

		if (hasRequiredAttrs) {
			continue;
		}

		supported.push(category);
	}

	return supported;
});

const withSeedLocationsFx = Effect.fn("withSeedLocationsFx")(function* ({
	count,
}: {
	count: number;
}) {
	const resolved: Array<{
		id: string;
		label: string;
	}> = [];
	const queryPool = withShuffle(LOCATION_QUERY_POOL);
	const targetCount = Math.max(12, Math.min(queryPool.length, count));
	const seenIds = new Set<string>();

	for (const query of queryPool) {
		const locations = yield* locationAutocompleteFx({
			text: query,
			lang: "cs",
			limit: 5,
		});

		for (const location of locations) {
			if (!location?.id || seenIds.has(location.id)) {
				continue;
			}

			seenIds.add(location.id);
			resolved.push({
				id: location.id,
				label: location.city ?? location.address ?? query,
			});

			if (resolved.length >= targetCount) {
				return resolved;
			}
		}
	}

	if (resolved.length === 0) {
		return yield* new RuntimeErrorFx({
			message: "No seed locations were resolved for listings.",
		});
	}

	return resolved;
});

export namespace listingSeedFx {
	export interface Props {
		count: number;
		userEmail: string;
	}
}

export const listingSeedFx = Effect.fn("listingSeedFx")(function* ({
	count,
	userEmail,
}: listingSeedFx.Props) {
	const progress = yield* SeedProgressContextFx;
	const phasePlan: SeedRunSummary.Phase[] = [
		{
			name: "Resolving user",
			done: 0,
			total: 1,
			status: "pending",
		},
		{
			name: "Preparing categories/assets/lookups",
			done: 0,
			total: 4,
			status: "pending",
		},
		{
			name: "Creating drafts",
			done: 0,
			total: count,
			status: "pending",
		},
		{
			name: "Publishing listings",
			done: 0,
			total: count,
			status: "pending",
		},
		{
			name: "Collecting summary",
			done: 0,
			total: 1,
			status: "pending",
		},
	];

	yield* progress.updateSummary({
		summary: {
			phases: phasePlan,
		},
	});

	yield* progress.startPhase({
		name: "Resolving user",
		total: 1,
	});

	const user = yield* ensureSeedUserFx({
		email: userEmail,
	});

	yield* progress.updateSummary({
		summary: {
			userEmail,
			userId: user.id,
		},
	});
	yield* progress.log({
		message: `Using seed user ${userEmail}`,
	});
	yield* progress.advance();
	yield* progress.finishPhase();

	yield* progress.startPhase({
		name: "Preparing categories/assets/lookups",
		total: 4,
	});

	const beforeTotal = yield* withListingTotalFx();
	yield* progress.updateSummary({
		summary: {
			beforeTotal,
		},
	});
	yield* progress.log({
		message: `Current listing total is ${beforeTotal}`,
	});
	yield* progress.advance();

	const supportedCategories = yield* withSupportedCategoriesFx();
	yield* progress.log({
		message: `Prepared ${supportedCategories.length} publishable categories`,
	});
	yield* progress.advance();

	const locations = yield* withSeedLocationsFx({
		count,
	});
	yield* progress.log({
		message: `Prepared ${locations.length} reusable locations`,
	});
	yield* progress.advance();

	const uploadPool = yield* ensureSeedUploadPoolFx({
		userId: user.id,
		targetCount: Math.min(64, Math.max(1, count)),
	});
	yield* progress.log({
		message: `Prepared ${uploadPool.length} reusable uploads`,
	});
	yield* progress.advance();
	yield* progress.finishPhase();

	if (supportedCategories.length === 0) {
		return yield* new RuntimeErrorFx({
			message: "No publishable categories are available for listing seed.",
		});
	}

	if (uploadPool.length === 0) {
		return yield* new RuntimeErrorFx({
			message: "No reusable uploads are available for listing seed.",
		});
	}

	yield* progress.startPhase({
		name: "Creating drafts",
		total: count,
	});

	const uploadRows = yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("upload")
			.select([
				"id",
				"url",
			])
			.where("id", "in", uploadPool)
			.execute();
	});
	const uploadRowById = new Map(
		uploadRows.map((item) => {
			return [
				item.id,
				item,
			] as const;
		}),
	);
	const resolvedUploadPool = uploadPool.flatMap((uploadId) => {
		const upload = uploadRowById.get(uploadId);

		return upload
			? [
					upload,
				]
			: [];
	}) satisfies SeedResolvedUpload[];

	if (resolvedUploadPool.length === 0) {
		return yield* new RuntimeErrorFx({
			message: "No reusable upload rows were resolved for listing seed.",
		});
	}

	const batchStore = yield* Effect.acquireRelease(createListingSeedBatchStoreFx(), (store) =>
		removeListingSeedBatchStoreFx(store).pipe(Effect.orDie),
	);
	const batchCount = Math.ceil(count / PUBLISH_PLAN_BATCH_SIZE);
	const batchFilePaths: string[] = [];

	for (let batchIndex = 0; batchIndex < batchCount; batchIndex += 1) {
		const batchOffset = batchIndex * PUBLISH_PLAN_BATCH_SIZE;
		const batchSize = Math.min(PUBLISH_PLAN_BATCH_SIZE, count - batchOffset);
		const plans = yield* buildSeedListingPlansFx({
			count: batchSize,
			offset: batchOffset,
			supportedCategories,
			locations,
			uploadPool: resolvedUploadPool,
			toSeedBranch(slug) {
				const branch = toSeedBranch(slug);

				if (branch.length === 0) {
					throw new Error(
						`Seed dataset is empty for category ${slug} and default fallback.`,
					);
				}

				return branch;
			},
			loadCategoryAttrs(categoryId) {
				return categoryAttrOfFx({
					categoryId,
				});
			},
			onPlanned: ({ count: plannedCount, plan, category }) => {
				return Effect.gen(function* () {
					const delta =
						plannedCount % CREATE_PROGRESS_INTERVAL || CREATE_PROGRESS_INTERVAL;
					const isBoundary =
						plannedCount % CREATE_PROGRESS_INTERVAL === 0 || plannedCount === count;

					if (!isBoundary) {
						return;
					}

					yield* progress.advance({
						delta:
							plannedCount === count
								? count % CREATE_PROGRESS_INTERVAL || CREATE_PROGRESS_INTERVAL
								: delta,
					});

					yield* progress.log({
						message: `Draft ${plannedCount}/${count}: ${plan.title} (${category.slug}, ${plan.locationLabel})`,
					});
				});
			},
		});

		const batchFile = yield* writeListingSeedBatchFx({
			...batchStore,
			batchIndex,
			plans,
		});

		batchFilePaths.push(batchFile.filePath);
		yield* progress.log({
			message: `Stored draft batch ${batchIndex + 1}/${batchCount} (${plans.length} listings)`,
		});
		yield* Effect.yieldNow();
	}

	yield* progress.finishPhase();

	yield* progress.startPhase({
		name: "Publishing listings",
		total: count,
	});

	let publishedCount = 0;

	for (const [batchIndex, filePath] of batchFilePaths.entries()) {
		const batch = yield* readListingSeedBatchFx({
			filePath,
		});
		const batchPublishedBase = publishedCount;

		yield* progress.log({
			message: `Publishing batch ${batchIndex + 1}/${batchFilePaths.length} (${batch.length} listings)`,
		});
		yield* listingSeedPublishFx({
			userId: user.id,
			plans: batch,
			onProgress: ({ message, delta, createdCount }) => {
				return Effect.gen(function* () {
					if (createdCount != null) {
						const nextCreatedCount = batchPublishedBase + createdCount;

						yield* progress.updateSummary({
							summary: {
								createdCount: nextCreatedCount,
							},
						});
						yield* progress.advance({
							delta: nextCreatedCount - publishedCount,
						});
						publishedCount = nextCreatedCount;

						yield* Effect.yieldNow();
					}

					if (createdCount == null && delta > 0) {
						yield* progress.log({
							message,
						});
					}
				});
			},
		});

		yield* removeListingSeedBatchFx({
			filePath,
		});
		yield* Effect.yieldNow();
	}

	yield* progress.finishPhase();

	yield* progress.startPhase({
		name: "Collecting summary",
		total: 1,
	});

	const afterTotal = yield* withListingTotalFx();
	yield* progress.updateSummary({
		summary: {
			afterTotal,
		},
	});
	yield* progress.log({
		message: `New listing total is ${afterTotal}`,
	});
	yield* progress.advance();
	yield* progress.finishPhase();

	return {
		seedId: "listings",
		seedLabel: "Listings",
		userEmail,
		userId: user.id,
		requestedCount: count,
		createdCount: publishedCount,
		beforeTotal,
		afterTotal,
		phases: phasePlan.map((phase) => ({
			...phase,
			done: phase.total,
			status: "completed",
		})),
		currentPhase: null,
	};
});
