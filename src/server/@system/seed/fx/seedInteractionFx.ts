import { Effect } from "effect";
import { DateTime } from "luxon";
import { genId } from "@/lib/common/gen-id";
import { feedCreateFx } from "~/buyer/feed/server/fx/feedCreateFx";
import { SeedProgressContextFx } from "~/server/@system/seed/context/withSeedProgressFx";
import { ensureSeedUserFx } from "~/server/@system/seed/fx/ensureSeedUserFx";
import { seedInteractionScenarioFx } from "~/server/@system/seed/fx/interaction/seedInteractionScenarioFx";
import { seedThumbBatchFx } from "~/server/@system/seed/fx/interaction/seedThumbBatchFx";
import { SeedInteractionReportSchema } from "~/server/@system/seed/fx/report/SeedInteractionReportSchema";
import { withInlineCounts } from "~/server/@system/seed/fx/report/seedReportConsole";
import {
	SeedPrimaryInteractionTables,
	withSeedTableCountsFx,
} from "~/server/@system/seed/fx/report/withSeedTableCountsFx";
import { withInteractionTimeline } from "~/server/@system/seed/fx/time/seedTime";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { RuntimeErrorFx } from "~/server/error/RuntimeErrorFx";
import { userExPatchFx } from "~/user/user-ex/server/fx/userExPatchFx";

const INTERACTION_SEED_CONCURRENCY = Number(process.env.SEED_INTERACTION_CONCURRENCY ?? 6);
const INTERACTION_BATCH_SIZE = Number(process.env.SEED_INTERACTION_BATCH_SIZE ?? 25);
const INTERACTION_SCENARIO_GAP_MINUTES = Number(
	process.env.SEED_INTERACTION_SCENARIO_GAP_MINUTES ?? 3,
);

export namespace seedInteractionFx {
	export interface Props {
		count: number;
		user: string;
	}
}

export const seedInteractionFx = Effect.fn("seedInteractionFx")(function* ({
	count,
	user,
}: seedInteractionFx.Props) {
	const progress = yield* SeedProgressContextFx;
	const { kysely } = yield* KyselyContextFx;

	const current = yield* ensureSeedUserFx({
		email: user,
	});
	yield* userExPatchFx({
		userId: current.id,
		patch: {
			locationId: null,
		},
	});

	const feeds = yield* tryDbFx(async () =>
		kysely
			.selectFrom("feed")
			.select("id")
			.where("userId", "=", current.id)
			.orderBy("updatedAt", "desc")
			.limit(1)
			.execute(),
	);
	const feedId =
		feeds[0]?.id ??
		(yield* feedCreateFx({
			userId: current.id,
			type: "user",
			name: `seed-interaction-${genId()}`,
			query: {},
			locationId: null,
		})).id;

	const listingCandidatesRaw = yield* tryDbFx(async () =>
		kysely
			.selectFrom("listing")
			.select([
				"id",
				"userId",
				"locationId",
				"createdAt",
			])
			.where("userId", "!=", current.id)
			.limit(Math.max(10000, count * 3))
			.execute(),
	);

	const thumbedListingIds = yield* listingCandidatesRaw.length === 0
		? Effect.succeed(
				[] as Array<{
					listingId: string;
				}>,
			)
		: tryDbFx(async () =>
				kysely
					.selectFrom("thumb")
					.select("listingId")
					.where("userId", "=", current.id)
					.where(
						"listingId",
						"in",
						listingCandidatesRaw.map((item) => item.id),
					)
					.execute(),
			);
	const thumbedListingIdSet = new Set(thumbedListingIds.map((item) => item.listingId));

	const listingCandidates = listingCandidatesRaw.filter(
		(item) => !thumbedListingIdSet.has(item.id),
	);
	const listingCandidatesFromOtherUsers = listingCandidates.filter(
		(item) => item.userId !== current.id,
	);

	const uniqueByListing = Array.from(
		new Map(
			listingCandidatesFromOtherUsers.map((item) => [
				item.id,
				item,
			]),
		).values(),
	);

	if (listingCandidatesFromOtherUsers.length !== listingCandidates.length) {
		yield* progress.log({
			message: `Excluded ${listingCandidates.length - listingCandidatesFromOtherUsers.length} own listings from interaction candidates.`,
		});
	}

	if (thumbedListingIdSet.size > 0) {
		yield* progress.log({
			message: `Excluded ${thumbedListingIdSet.size} already-thumbed listings from interaction candidates.`,
		});
	}

	if (uniqueByListing.length < count) {
		return yield* new RuntimeErrorFx({
			message: `seed-interaction requires at least ${count} listings from other users, found ${uniqueByListing.length}.`,
		});
	}

	const shuffled = uniqueByListing.slice();
	for (let i = shuffled.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		const a = shuffled[i];
		const b = shuffled[j];
		if (!a || !b) {
			continue;
		}
		shuffled[i] = b;
		shuffled[j] = a;
	}

	const before = yield* withSeedTableCountsFx({
		tables: SeedPrimaryInteractionTables,
	});

	yield* progress.startPhase({
		name: "Interaction scenarios",
		total: count,
	});

	let executed = 0;
	let cursor = 0;
	let planned = 0;

	while (executed < count && cursor < shuffled.length) {
		const remaining = count - executed;
		const batchSize = Math.min(
			remaining,
			Math.max(1, INTERACTION_BATCH_SIZE),
			shuffled.length - cursor,
		);
		const batch = shuffled.slice(cursor, cursor + batchSize);
		cursor += batch.length;

		const batchResults = yield* Effect.forEach(
			batch,
			(listing, index) => {
				return seedInteractionScenarioFx({
					actorUserId: current.id,
					listingId: listing.id,
					sellerId: listing.userId,
					locationId: listing.locationId,
					feedId,
					timeline: withInteractionTimeline({
						from: DateTime.fromJSDate(listing.createdAt),
						offsetMinutes:
							(planned + index) * Math.max(1, INTERACTION_SCENARIO_GAP_MINUTES),
					}),
				}).pipe(Effect.either);
			},
			{
				concurrency: INTERACTION_SEED_CONCURRENCY,
			},
		);
		planned += batch.length;

		const successCount = batchResults.reduce(
			(acc, item) => acc + (item._tag === "Right" ? 1 : 0),
			0,
		);
		const accepted = Math.min(successCount, remaining);
		executed += accepted;

		if (accepted > 0) {
			yield* progress.advance({
				delta: accepted,
			});
		}

		const failureCount = batchResults.length - accepted;
		if (failureCount > 0) {
			yield* progress.log({
				message: `Scenario batch retries needed (${failureCount}/${batchResults.length} failed, executed=${executed}/${count})`,
			});
		}
	}

	yield* progress.finishPhase();

	if (executed < count) {
		return yield* new RuntimeErrorFx({
			message: `Unable to execute requested interaction count. Requested ${count}, executed ${executed}`,
		});
	}

	yield* progress.startPhase({
		name: "Thumb reactions",
		total: count,
	});
	const thumbBatch = yield* seedThumbBatchFx({
		userId: current.id,
		count,
	});
	yield* progress.finishPhase();
	yield* progress.log({
		message: `Thumb batch done (processed=${thumbBatch.processed}, created=${thumbBatch.created})`,
	});

	const totals = yield* withSeedTableCountsFx({
		tables: SeedPrimaryInteractionTables,
	});
	const tables = Object.fromEntries(
		Object.entries(totals).map(([key, value]) => [
			key,
			Math.max(0, value - (before[key] ?? 0)),
		]),
	);
	yield* progress.log({
		message: `Generated in this run: ${withInlineCounts(tables)}`,
	});
	yield* progress.finishAll();

	return SeedInteractionReportSchema.parse({
		userId: current.id,
		user,
		count,
		executed,
		tables,
		totals,
	});
});

export type seedInteractionFx = ReturnType<typeof seedInteractionFx>;
