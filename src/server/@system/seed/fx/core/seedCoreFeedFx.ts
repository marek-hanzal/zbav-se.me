import { Effect } from "effect";
import { genId } from "@/lib/common/gen-id";
import { SeedProgressContextFx } from "~/server/@system/seed/context/withSeedProgressFx";
import { withSeedConcurrency } from "~/server/@system/seed/fx/core/seedConcurrency";
import { seedFeedInsertFx } from "~/server/@system/seed/fx/core/seedFeedInsertFx";
import { withRandomPastDate } from "~/server/@system/seed/fx/time/seedTime";
import { withSeedNowFx } from "~/server/@system/seed/fx/time/withSeedNowFx";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

const FEED_SEED_CONCURRENCY = withSeedConcurrency("SEED_FEED_CONCURRENCY");
const FEED_TX_CHUNK_SIZE = 25;

export const seedCoreFeedFx = Effect.fn("seedCoreFeedFx")(function* ({
	userId,
	deficit,
}: {
	userId: string;
	deficit: number;
}) {
	const progress = yield* SeedProgressContextFx;
	const { kysely } = yield* KyselyContextFx;
	if (deficit <= 0) {
		return;
	}

	const locations = yield* tryDbFx(async () =>
		kysely
			.selectFrom("location")
			.select("id")
			.orderBy("query", "asc")
			.limit(Math.max(1, deficit))
			.execute(),
	);

	const indices = Array.from({
		length: deficit,
	}).map((_, i) => i);
	const chunks: number[][] = [];
	for (let i = 0; i < indices.length; i += FEED_TX_CHUNK_SIZE) {
		chunks.push(indices.slice(i, i + FEED_TX_CHUNK_SIZE));
	}

	yield* Effect.forEach(
		chunks,
		(chunk) =>
			withTransactionFx(
				Effect.gen(function* () {
					yield* Effect.forEach(chunk, (i) =>
						Effect.gen(function* () {
							const location = locations[i % Math.max(1, locations.length)];
							yield* seedFeedInsertFx({
								userId,
								type: "user",
								name: `seed-${genId()}-${i}`,
								query: {
									meta: {
										locationId: location?.id,
									},
								},
							}).pipe(withSeedNowFx(withRandomPastDate()));
						}),
					);
					yield* progress.advance({
						delta: chunk.length,
					});
				}),
			),
		{
			concurrency: FEED_SEED_CONCURRENCY,
		},
	);

	yield* progress.log({
		message: `Feed generation done (${deficit})`,
	});
});

export type seedCoreFeedFx = ReturnType<typeof seedCoreFeedFx>;
