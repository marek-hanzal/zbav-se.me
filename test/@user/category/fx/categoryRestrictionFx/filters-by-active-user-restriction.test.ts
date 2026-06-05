import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { DateServiceFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import type { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { categoryCollectionFx } from "~/user/category/server/fx/categoryCollectionFx";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;
type CategoryRestriction = RestrictionEnumSchema.Type;

interface RestrictionRecord {
	restriction: CategoryRestriction;
	availableAtOffsetMinutes: number;
	createdAtOffsetMinutes: number;
}

interface Scenario {
	name: string;
	records: RestrictionRecord[];
	expectedRestrictions: CategoryRestriction[];
}

const restrictionLevels = [
	"none",
	"adult-relaxed",
	"adult",
	"sensitive",
	"restricted",
] as const satisfies CategoryRestriction[];

const createRestrictedCategories = (database: TestDatabase, slugPrefix: string) =>
	Effect.promise(async () => {
		const categories = restrictionLevels.map((restriction, index) => ({
			id: genId(),
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

const createUserRestrictions = (
	database: TestDatabase,
	props: {
		userId: string;
		records: RestrictionRecord[];
	},
) =>
	Effect.gen(function* () {
		if (props.records.length === 0) {
			return;
		}

		const dateContext = yield* DateServiceFx;
		const now = dateContext.now();

		yield* Effect.promise(() =>
			database.kysely
				.insertInto("user_restriction")
				.values(
					props.records.map((record) => ({
						id: genId(),
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

const fetchAvailableRestrictions = (userId: string, categoryIdIn: string[]) =>
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

const fetchRestrictionFlags = (userId: string, categoryIdIn: string[]) =>
	categoryCollectionFx({
		userId,
		scope: {},
		where: {
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
			categories.map((category) => ({
				restriction: category.restriction as CategoryRestriction,
				isRestricted: category.isRestricted,
			})),
		),
	);

describe("user category restriction scope", () => {
	it("filters categories by the latest active user restriction", async () => {
		const database = await testabase("user-category-active-restriction-scope");

		const scenarios = [
			{
				name: "falls back to none when no user restriction exists",
				records: [],
				expectedRestrictions: [
					"none",
				],
			},
			{
				name: "ignores a future sensitive restriction",
				records: [
					{
						restriction: "sensitive",
						availableAtOffsetMinutes: 60,
						createdAtOffsetMinutes: -5,
					},
				],
				expectedRestrictions: [
					"none",
				],
			},
			{
				name: "uses active adult while future sensitive waits",
				records: [
					{
						restriction: "adult",
						availableAtOffsetMinutes: -10,
						createdAtOffsetMinutes: -20,
					},
					{
						restriction: "sensitive",
						availableAtOffsetMinutes: 60,
						createdAtOffsetMinutes: -5,
					},
				],
				expectedRestrictions: [
					"none",
					"adult-relaxed",
					"adult",
				],
			},
			{
				name: "uses the newest active row instead of the strongest old row",
				records: [
					{
						restriction: "sensitive",
						availableAtOffsetMinutes: -120,
						createdAtOffsetMinutes: -120,
					},
					{
						restriction: "adult-relaxed",
						availableAtOffsetMinutes: -10,
						createdAtOffsetMinutes: -10,
					},
				],
				expectedRestrictions: [
					"none",
					"adult-relaxed",
				],
			},
			{
				name: "allows every category for active restricted",
				records: [
					{
						restriction: "restricted",
						availableAtOffsetMinutes: -10,
						createdAtOffsetMinutes: -10,
					},
				],
				expectedRestrictions: [
					"none",
					"adult-relaxed",
					"adult",
					"sensitive",
					"restricted",
				],
			},
		] satisfies Scenario[];

		return Effect.gen(function* () {
			const categoryIdIn = yield* createRestrictedCategories(database, "restriction-scope");

			for (const scenario of scenarios) {
				const user = yield* leaseTestUserFx({});

				yield* createUserRestrictions(database, {
					userId: user.id,
					records: scenario.records,
				});

				const restrictions = yield* fetchAvailableRestrictions(user.id, categoryIdIn);

				expect(restrictions, scenario.name).toEqual(scenario.expectedRestrictions);

				const restrictionFlags = yield* fetchRestrictionFlags(user.id, categoryIdIn);
				const expectedRestrictions: readonly CategoryRestriction[] =
					scenario.expectedRestrictions;
				const expectedRestrictionFlags = restrictionLevels.map((restriction) => ({
					restriction,
					isRestricted: !expectedRestrictions.includes(restriction),
				}));

				expect(restrictionFlags, scenario.name).toEqual(expectedRestrictionFlags);
			}
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
