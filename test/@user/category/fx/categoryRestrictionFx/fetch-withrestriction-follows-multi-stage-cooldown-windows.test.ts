import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { genIdFn } from "~/identity/fn/genIdFn";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { categoryFetchFx } from "~/user-category/fx/categoryFetchFx";

const atFx = <A, E, R>(iso: string, eff: Effect.Effect<A, E, R>) =>
	eff.pipe(
		withDateServiceFn({
			nowFn: () => DateTime.fromISO(iso),
		}),
	);

describe("user category restriction fetch flow", () => {
	it("keeps fetch-withrestriction aligned with staged cooldown boundaries", async () => {
		const database = await testabaseFn("user-category-fetch-multi-stage-cooldown");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("category")
					.values([
						{
							id: genIdFn(),
							group: "Restriction fetch fixture",
							category: "Restriction fetch none",
							slug: "restriction-fetch-none",
							sort: 0,
							locale: "cs",
							discovery: "implicit",
							restriction: "none",
						},
						{
							id: genIdFn(),
							group: "Restriction fetch fixture",
							category: "Restriction fetch adult",
							slug: "restriction-fetch-adult",
							sort: 1,
							locale: "cs",
							discovery: "implicit",
							restriction: "adult",
						},
						{
							id: genIdFn(),
							group: "Restriction fetch fixture",
							category: "Restriction fetch restricted",
							slug: "restriction-fetch-restricted",
							sort: 2,
							locale: "cs",
							discovery: "implicit",
							restriction: "restricted",
						},
					])
					.execute(),
			);

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("user_restriction")
					.values([
						{
							id: genIdFn(),
							userId: user.id,
							restriction: "adult",
							availableAt: new Date("2026-05-01T09:55:00.000Z"),
							expiresAt: new Date("2026-05-01T10:30:00.000Z"),
							createdAt: new Date("2026-05-01T09:55:00.000Z"),
						},
						{
							id: genIdFn(),
							userId: user.id,
							restriction: "restricted",
							availableAt: new Date("2026-05-01T10:30:00.000Z"),
							expiresAt: new Date("2026-05-01T11:30:00.000Z"),
							createdAt: new Date("2026-05-01T10:01:00.000Z"),
						},
						{
							id: genIdFn(),
							userId: user.id,
							restriction: "none",
							availableAt: new Date("2026-05-01T11:30:00.000Z"),
							expiresAt: null,
							createdAt: new Date("2026-05-01T10:02:00.000Z"),
						},
					])
					.execute(),
			);

			const beforeFirstBoundaryAdult = yield* atFx(
				"2026-05-01T10:29:59.999Z",
				categoryFetchFx({
					userId: user.id,
					scope: {},
					where: {
						slug: "restriction-fetch-adult",
						withRestriction: true,
					},
				}),
			);
			const beforeFirstBoundaryRestricted = yield* atFx(
				"2026-05-01T10:29:59.999Z",
				Effect.result(
					categoryFetchFx({
						userId: user.id,
						scope: {},
						where: {
							slug: "restriction-fetch-restricted",
							withRestriction: true,
						},
					}),
				),
			);
			const duringRestrictedWindow = yield* atFx(
				"2026-05-01T10:30:00.000Z",
				categoryFetchFx({
					userId: user.id,
					scope: {},
					where: {
						slug: "restriction-fetch-restricted",
						withRestriction: true,
					},
				}),
			);
			const afterReturnToNoneAdult = yield* atFx(
				"2026-05-01T11:30:00.000Z",
				Effect.result(
					categoryFetchFx({
						userId: user.id,
						scope: {},
						where: {
							slug: "restriction-fetch-adult",
							withRestriction: true,
						},
					}),
				),
			);
			const unrestrictedFetchStillWorks = yield* atFx(
				"2026-05-01T11:30:00.000Z",
				categoryFetchFx({
					userId: user.id,
					scope: {},
					where: {
						slug: "restriction-fetch-restricted",
					},
				}),
			);

			expect(beforeFirstBoundaryAdult.slug).toBe("restriction-fetch-adult");
			expectTaggedErrorFn(beforeFirstBoundaryRestricted, {
				tag: "NotFoundErrorFx",
			});
			expect(duringRestrictedWindow.slug).toBe("restriction-fetch-restricted");
			expectTaggedErrorFn(afterReturnToNoneAdult, {
				tag: "NotFoundErrorFx",
			});
			expect(unrestrictedFetchStillWorks.slug).toBe("restriction-fetch-restricted");
			expect(unrestrictedFetchStillWorks.isRestricted).toBe(true);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
