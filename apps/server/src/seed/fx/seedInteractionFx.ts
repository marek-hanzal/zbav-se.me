import { genId } from "@use-pico/common/gen-id";
import { list } from "@use-pico/common/rangedom";
import { Effect } from "effect";
import { feedCreateFx } from "~/@buyer-user/feed/fx/feedCreateFx";
import { userExPatchFx } from "~/@user/user-ex/fx/userExPatchFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { RuntimeErrorFx } from "~/error/RuntimeErrorFx";
import { SeedProgressContextFx } from "~/seed/context/SeedProgressContextFx";
import { ensureSeedUserFx } from "~/seed/fx/ensureSeedUserFx";
import { seedInteractionScenarioFx } from "~/seed/fx/interaction/seedInteractionScenarioFx";
import { SeedInteractionReportSchema } from "~/seed/fx/report/SeedInteractionReportSchema";
import { withInlineCounts } from "~/seed/fx/report/seedReportConsole";
import {
	SeedPrimaryInteractionTables,
	withSeedTableCountsFx,
} from "~/seed/fx/report/withSeedTableCountsFx";

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
			side: list([
				"seller",
				"buyer",
			]),
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
			name: `seed-interaction-${genId()}`,
			query: {},
			locationId: null,
		})).id;

	const listingCandidates = yield* tryDbFx(async () =>
		kysely
			.selectFrom("listing")
			.select([
				"id",
				"userId",
			])
			.where("userId", "!=", current.id)
			.limit(10000)
			.execute(),
	);

	if (listingCandidates.length === 0) {
		return yield* new RuntimeErrorFx({
			message:
				"seed-interaction requires listings from other users. Run seed-core with existing multi-user data first.",
		});
	}

	const before = yield* withSeedTableCountsFx({
		tables: SeedPrimaryInteractionTables,
	});

	yield* progress.startPhase({
		name: "Interaction scenarios",
		total: count,
	});

	let executed = 0;
	let attempts = 0;
	const maxAttempts = Math.max(count * 20, 100);

	while (executed < count && attempts < maxAttempts) {
		attempts += 1;
		const listing = listingCandidates[Math.floor(Math.random() * listingCandidates.length)];
		if (!listing) {
			continue;
		}

		const result = yield* seedInteractionScenarioFx({
			actorUserId: current.id,
			listingId: listing.id,
			sellerId: listing.userId,
			feedId,
		}).pipe(Effect.either);

		if (result._tag === "Right") {
			executed += 1;
			yield* progress.advance({
				delta: 1,
			});
		} else if (attempts % 25 === 0) {
			yield* progress.log({
				message: `Retrying scenarios (${attempts} attempts, ${executed} executed): ${String(result.left)}`,
			});
		}
	}

	yield* progress.finishPhase();

	if (executed < count) {
		return yield* new RuntimeErrorFx({
			message: `Unable to execute requested interaction count. Requested ${count}, executed ${executed}`,
		});
	}

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

	const report = SeedInteractionReportSchema.parse({
		userId: current.id,
		user,
		count,
		executed,
		tables,
		totals,
	});

	return report;
});

export type seedInteractionFx = ReturnType<typeof seedInteractionFx>;
