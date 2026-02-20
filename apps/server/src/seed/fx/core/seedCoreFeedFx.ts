import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { SeedProgressContextFx } from "~/seed/context/SeedProgressContextFx";
import { withSeedConcurrency } from "~/seed/fx/core/seedConcurrency";
import { seedFeedInsertFx } from "~/seed/fx/core/seedFeedInsertFx";
import { withRandomPastDate } from "~/seed/fx/time/seedTime";
import { withSeedNowFx } from "~/seed/fx/time/withSeedNowFx";

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
								name: `seed-${genId()}-${i}`,
								locationId: location?.id ?? null,
								query: {},
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
