import { Effect } from "effect";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { SeedProgressContextFx } from "~/seed/context/withSeedProgressFx";
import { seedThumbInsertFx } from "~/seed/fx/interaction/seedThumbInsertFx";
import { withRandomPastDate } from "~/seed/fx/time/seedTime";
import { withSeedNowFx } from "~/seed/fx/time/withSeedNowFx";

const THUMB_BATCH_SIZE = Number(process.env.SEED_INTERACTION_THUMB_BATCH_SIZE ?? 100);
const THUMB_INSERT_CONCURRENCY = Number(process.env.SEED_INTERACTION_THUMB_CONCURRENCY ?? 12);
const THUMB_POOL_MULTIPLIER = 5;

const withShuffle = <T>(items: T[]) => {
	const next = items.slice();
	for (let i = next.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		const a = next[i];
		const b = next[j];
		if (!a || !b) {
			continue;
		}
		next[i] = b;
		next[j] = a;
	}
	return next;
};

export namespace seedThumbBatchFx {
	export interface Props {
		userId: string;
		count: number;
	}
}

export const seedThumbBatchFx = Effect.fn("seedThumbBatchFx")(function* ({
	userId,
	count,
}: seedThumbBatchFx.Props) {
	const progress = yield* SeedProgressContextFx;
	const { kysely } = yield* KyselyContextFx;

	if (count <= 0) {
		return {
			processed: 0,
			created: 0,
		};
	}

	const listingPool = yield* tryDbFx(async () =>
		kysely
			.selectFrom("listing")
			.select("id")
			.where("userId", "!=", userId)
			.limit(Math.max(5000, count * THUMB_POOL_MULTIPLIER))
			.execute(),
	);

	if (listingPool.length === 0) {
		return {
			processed: 0,
			created: 0,
		};
	}

	const thumbed = yield* tryDbFx(async () =>
		kysely
			.selectFrom("thumb")
			.select("listingId")
			.where("userId", "=", userId)
			.where(
				"listingId",
				"in",
				listingPool.map((item) => item.id),
			)
			.execute(),
	);

	const thumbedSet = new Set(thumbed.map((item) => item.listingId));
	const available = withShuffle(listingPool.map((item) => item.id)).filter(
		(listingId) => !thumbedSet.has(listingId),
	);
	const selected = available.slice(0, Math.min(count, available.length));

	if (selected.length < count) {
		yield* progress.log({
			message: `Thumb batch has only ${selected.length} unthumbed candidates (requested ${count}).`,
		});
	}

	let created = 0;
	for (let i = 0; i < selected.length; i += Math.max(1, THUMB_BATCH_SIZE)) {
		const batch = selected.slice(i, i + Math.max(1, THUMB_BATCH_SIZE));

		const results = yield* Effect.forEach(
			batch,
			(listingId) =>
				Effect.gen(function* () {
					const roll = Math.random();
					if (roll < 0.34) {
						return false;
					}

					yield* seedThumbInsertFx({
						userId,
						listingId,
						type: roll < 0.67 ? "like" : "dislike",
					}).pipe(withSeedNowFx(withRandomPastDate()));

					return true;
				}),
			{
				concurrency: THUMB_INSERT_CONCURRENCY,
			},
		);

		created += results.reduce((acc, item) => acc + (item ? 1 : 0), 0);
		yield* progress.advance({
			delta: batch.length,
		});
	}

	return {
		processed: selected.length,
		created,
	};
});

export type seedThumbBatchFx = ReturnType<typeof seedThumbBatchFx>;
