import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateServiceFx } from "@/lib/common/date";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { withUserRestrictionActiveSelectFx } from "~/user/user-restriction/server/db/withUserRestrictionActiveSelectFx";

const atFx = <A, E, R>(iso: string, eff: Effect.Effect<A, E, R>) =>
	eff.pipe(
		Effect.provideService(DateServiceFx, {
			now: () => DateTime.fromISO(iso),
		}),
	);

const resolveActiveRestrictionFx = (userId?: string) =>
	Effect.gen(function* () {
		const { kysely } = yield* KyselyContextFx;

		if (!userId) {
			const select = (yield* withUserRestrictionActiveSelectFx({})) as {
				executeTakeFirstOrThrow(): Promise<{
					restriction: RestrictionEnumSchema.Type;
				}>;
			};
			const row = yield* Effect.promise(() => select.executeTakeFirstOrThrow());
			return row.restriction;
		}

		const restrictionSql = (yield* withUserRestrictionActiveSelectFx({
			userId,
		})) as {
			as(alias: string): unknown;
		};
		const row = (yield* Effect.promise(() =>
			kysely
				.selectNoFrom([
					restrictionSql.as("restriction") as never,
				])
				.executeTakeFirstOrThrow(),
		)) as {
			restriction: RestrictionEnumSchema.Type;
		};

		return row.restriction;
	});

describe("withUserRestrictionActiveSelectFx", () => {
	it("returns none without a user and resolves the newest currently active row for a user", async () => {
		const database = await testabase("user-restriction-active-select");

		return Effect.gen(function* () {
			const { seller } = yield* createUsersFx({});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("user_restriction")
					.values([
						{
							id: "older-restricted",
							userId: seller.id,
							restriction: "restricted",
							availableAt: new Date("2026-04-26T08:00:00.000Z"),
							expiresAt: new Date("2026-04-26T10:30:00.000Z"),
							createdAt: new Date("2026-04-26T08:00:00.000Z"),
						},
						{
							id: "current-adult",
							userId: seller.id,
							restriction: "adult",
							availableAt: new Date("2026-04-26T10:30:00.000Z"),
							expiresAt: null,
							createdAt: new Date("2026-04-26T10:30:00.000Z"),
						},
						{
							id: "future-sensitive",
							userId: seller.id,
							restriction: "sensitive",
							availableAt: new Date("2026-04-26T13:00:00.000Z"),
							expiresAt: null,
							createdAt: new Date("2026-04-26T11:00:00.000Z"),
						},
					])
					.execute(),
			);

			const fallback = yield* atFx("2026-04-26T12:00:00.000Z", resolveActiveRestrictionFx());
			const activeAtNoon = yield* atFx(
				"2026-04-26T12:00:00.000Z",
				resolveActiveRestrictionFx(seller.id),
			);
			const activeAtFutureBoundary = yield* atFx(
				"2026-04-26T13:00:00.000Z",
				resolveActiveRestrictionFx(seller.id),
			);

			expect(fallback).toBe(RestrictionEnumSchema.enum.none);
			expect(activeAtNoon).toBe("adult");
			expect(activeAtFutureBoundary).toBe("sensitive");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
