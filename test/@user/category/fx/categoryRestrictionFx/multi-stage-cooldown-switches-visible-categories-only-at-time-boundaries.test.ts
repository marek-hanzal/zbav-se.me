import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { genIdFn } from "~/identity/fn/genIdFn";
import type { RestrictionEnumSchema } from "~/restriction/schema/RestrictionEnumSchema";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { categoryCollectionFx } from "~/user-category/fx/categoryCollectionFx";

type TestDatabase = Awaited<ReturnType<typeof testabaseFn>>;
type CategoryRestriction = RestrictionEnumSchema.Type;

const restrictionLevels = [
	"none",
	"adult-relaxed",
	"adult",
	"sensitive",
	"restricted",
] as const satisfies CategoryRestriction[];

const atFx = <A, E, R>(iso: string, eff: Effect.Effect<A, E, R>) =>
	eff.pipe(
		withDateServiceFn({
			nowFn: () => DateTime.fromISO(iso),
		}),
	);

const createRestrictedCategoriesFx = (database: TestDatabase, slugPrefix: string) =>
	Effect.promise(async () => {
		const categories = restrictionLevels.map((restriction, index) => ({
			id: genIdFn(),
			group: `Restriction fixture ${slugPrefix}`,
			category: `Restriction fixture ${restriction}`,
			slug: `${slugPrefix}-${restriction}`,
			sort: index,
			locale: "cs",
			discovery: "implicit" as const,
			restriction,
		}));

		await database.kysely.insertInto("category").values(categories).execute();

		return categories.map((category) => category.id);
	});

const createUserRestrictionsFx = (
	database: TestDatabase,
	props: {
		userId: string;
		records: Array<{
			restriction: CategoryRestriction;
			availableAtOffsetMinutes: number;
			createdAtOffsetMinutes: number;
		}>;
	},
) =>
	Effect.gen(function* () {
		const dateContext = yield* DateServiceFx;
		const now = dateContext.nowFn();

		yield* Effect.promise(() =>
			database.kysely
				.insertInto("user_restriction")
				.values(
					props.records.map((record) => ({
						id: genIdFn(),
						userId: props.userId,
						restriction: record.restriction,
						availableAt: now
							.plus({
								minutes: record.availableAtOffsetMinutes,
							})
							.toJSDate(),
						expiresAt: null,
						createdAt: now
							.plus({
								minutes: record.createdAtOffsetMinutes,
							})
							.toJSDate(),
					})),
				)
				.execute(),
		);
	});

const fetchVisibleRestrictionsFx = (userId: string, categoryIdIn: string[]) =>
	categoryCollectionFx({
		userId,
		scope: {},
		where: {
			withRestriction: true,
			idIn: categoryIdIn,
		},
		sort: [
			{
				field: "sort",
				order: "asc",
			},
		],
	}).pipe(
		Effect.map((categories) =>
			categories.map((category) => category.restriction as CategoryRestriction),
		),
	);

describe("user category restriction cooldown flow", () => {
	it("switches visible category levels only when staged restrictions cross their availability boundaries", async () => {
		const database = await testabaseFn("user-category-restriction-multi-stage-cooldown");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});
			const categoryIdIn = yield* createRestrictedCategoriesFx(
				database,
				"restriction-multi-stage",
			);

			yield* atFx(
				"2026-04-29T09:00:00.000Z",
				createUserRestrictionsFx(database, {
					userId: user.id,
					records: [
						{
							restriction: "adult-relaxed",
							availableAtOffsetMinutes: -5,
							createdAtOffsetMinutes: -5,
						},
						{
							restriction: "restricted",
							availableAtOffsetMinutes: 30,
							createdAtOffsetMinutes: 1,
						},
						{
							restriction: "none",
							availableAtOffsetMinutes: 90,
							createdAtOffsetMinutes: 2,
						},
					],
				}),
			);

			const beforeFirstBoundary = yield* atFx(
				"2026-04-29T09:29:59.999Z",
				fetchVisibleRestrictionsFx(user.id, categoryIdIn),
			);
			const atRestrictedBoundary = yield* atFx(
				"2026-04-29T09:30:00.000Z",
				fetchVisibleRestrictionsFx(user.id, categoryIdIn),
			);
			const atReturnToNoneBoundary = yield* atFx(
				"2026-04-29T10:30:00.000Z",
				fetchVisibleRestrictionsFx(user.id, categoryIdIn),
			);

			expect(beforeFirstBoundary).toEqual([
				"none",
				"adult-relaxed",
			]);
			expect(atRestrictedBoundary).toEqual([
				"none",
				"adult-relaxed",
				"adult",
				"sensitive",
				"restricted",
			]);
			expect(atReturnToNoneBoundary).toEqual([
				"none",
			]);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
