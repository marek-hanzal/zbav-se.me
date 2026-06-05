import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateServiceFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { categoryFetchFx } from "~/user/category/server/fx/categoryFetchFx";

const atFx = <A, E, R>(iso: string, eff: Effect.Effect<A, E, R>) =>
	eff.pipe(
		Effect.provideService(DateServiceFx, {
			now: () => DateTime.fromISO(iso),
		}),
	);

describe("user category restriction fetch flow", () => {
	it("keeps fetch-withrestriction aligned with staged cooldown boundaries", async () => {
		const database = await testabase("user-category-fetch-multi-stage-cooldown");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("category")
					.values([
						{
							id: genId(),
							group: "Restriction fetch fixture",
							category: "Restriction fetch none",
							slug: "restriction-fetch-none",
							sort: 0,
							locale: "cs",
							discovery: "implicit",
							restriction: "none",
						},
						{
							id: genId(),
							group: "Restriction fetch fixture",
							category: "Restriction fetch adult",
							slug: "restriction-fetch-adult",
							sort: 1,
							locale: "cs",
							discovery: "implicit",
							restriction: "adult",
						},
						{
							id: genId(),
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
							id: genId(),
							userId: user.id,
							restriction: "adult",
							availableAt: new Date("2026-05-01T09:55:00.000Z"),
							expiresAt: new Date("2026-05-01T10:30:00.000Z"),
							createdAt: new Date("2026-05-01T09:55:00.000Z"),
						},
						{
							id: genId(),
							userId: user.id,
							restriction: "restricted",
							availableAt: new Date("2026-05-01T10:30:00.000Z"),
							expiresAt: new Date("2026-05-01T11:30:00.000Z"),
							createdAt: new Date("2026-05-01T10:01:00.000Z"),
						},
						{
							id: genId(),
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
				Effect.either(
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
				Effect.either(
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
			expectTaggedErrorFx(beforeFirstBoundaryRestricted, {
				tag: "NotFoundErrorFx",
			});
			expect(duringRestrictedWindow.slug).toBe("restriction-fetch-restricted");
			expectTaggedErrorFx(afterReturnToNoneAdult, {
				tag: "NotFoundErrorFx",
			});
			expect(unrestrictedFetchStillWorks.slug).toBe("restriction-fetch-restricted");
			expect(unrestrictedFetchStillWorks.isRestricted).toBe(true);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
