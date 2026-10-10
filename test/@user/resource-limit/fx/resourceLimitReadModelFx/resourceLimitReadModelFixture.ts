import { Effect } from "effect";
import { DateTime } from "luxon";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { genIdFn } from "~/identity/fn/genIdFn";
import type { ResourceDefinitionEnumSchema } from "~/resource-definition/schema/ResourceDefinitionEnumSchema";
import type { testabaseFn } from "~/test/testabaseFn";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

type TestDatabase = Awaited<ReturnType<typeof testabaseFn>>;

interface ResourceBundleLimitSeed {
	userId: string;
	resourceDefinitionId: ResourceDefinitionEnumSchema.Type;
	availableAt: string;
	createdAt: string;
	expiresAt: string | null;
	limit: number;
}

const dateFn = (iso: string) => new Date(iso);

const limitSeedFn = (
	userId: string,
	resourceDefinitionId: ResourceDefinitionEnumSchema.Type,
	availableAt: string,
	createdAt: string,
	expiresAt: string | null,
	limit: number,
): ResourceBundleLimitSeed => ({
	userId,
	resourceDefinitionId,
	createdAt,
	availableAt,
	expiresAt,
	limit,
});

export const atResourceLimitReadModelFx = <A, E, R>(iso: string, eff: Effect.Effect<A, E, R>) =>
	eff.pipe(
		withDateServiceFn({
			nowFn: () => DateTime.fromISO(iso),
		}),
	);

export const seedResourceLimitReadModelFx = (database: TestDatabase) =>
	Effect.gen(function* () {
		const { seller, buyer } = yield* createUsersFx({});

		yield* Effect.promise(async () => {
			await database.kysely
				.deleteFrom("user_resource_bundle")
				.where("userId", "in", [
					seller.id,
					buyer.id,
				])
				.execute();
		});

		const seeds = [
			limitSeedFn(
				seller.id,
				"seller:limit:listing.count",
				"2026-05-10T08:00:00.000Z",
				"2026-05-10T08:00:00.000Z",
				null,
				2,
			),
			limitSeedFn(
				seller.id,
				"seller:limit:listing.count",
				"2026-05-12T08:00:00.000Z",
				"2026-05-12T08:45:00.000Z",
				null,
				7,
			),
			limitSeedFn(
				seller.id,
				"seller:limit:listing.count",
				"2026-05-13T08:00:00.000Z",
				"2026-05-13T08:30:00.000Z",
				null,
				99,
			),
			limitSeedFn(
				seller.id,
				"buyer:limit:feed.count",
				"2026-05-10T09:00:00.000Z",
				"2026-05-10T09:00:00.000Z",
				null,
				4,
			),
			limitSeedFn(
				seller.id,
				"seller:limit:listing.gallery.count",
				"2026-05-10T10:00:00.000Z",
				"2026-05-10T10:00:00.000Z",
				null,
				10,
			),
			limitSeedFn(
				seller.id,
				"seller:limit:listing.gallery.count",
				"2026-05-12T11:30:00.000Z",
				"2026-05-12T11:30:00.000Z",
				null,
				25,
			),
			limitSeedFn(
				buyer.id,
				"buyer:limit:feed.count",
				"2026-05-10T12:00:00.000Z",
				"2026-05-10T12:00:00.000Z",
				null,
				1,
			),
			limitSeedFn(
				buyer.id,
				"seller:limit:listing.gallery.count",
				"2026-05-10T12:00:00.000Z",
				"2026-05-10T12:00:00.000Z",
				null,
				666,
			),
		];

		yield* Effect.promise(async () => {
			for (const seed of seeds) {
				const resourceBundleId = genIdFn();

				await database.kysely
					.insertInto("resource_bundle")
					.values({
						id: resourceBundleId,
						name: `Test bundle ${resourceBundleId}`,
						type: "user",
						access: "protected",
						sort: 0,
					})
					.execute();

				const userResourceBundle = await database.kysely
					.insertInto("user_resource_bundle")
					.values({
						id: genIdFn(),
						userId: seed.userId,
						resourceBundleId,
						createdAt: dateFn(seed.createdAt),
						availableAt: dateFn(seed.availableAt),
						expiresAt: seed.expiresAt ? dateFn(seed.expiresAt) : null,
					})
					.returning([
						"id",
					])
					.executeTakeFirstOrThrow();

				await database.kysely
					.insertInto("user_resource_bundle_limit")
					.values({
						id: genIdFn(),
						userResourceBundleId: userResourceBundle.id,
						resourceDefinitionId: seed.resourceDefinitionId,
						limit: seed.limit,
						createdAt: dateFn(seed.createdAt),
						availableAt: dateFn(seed.availableAt),
						expiresAt: seed.expiresAt ? dateFn(seed.expiresAt) : null,
					})
					.execute();
			}
		});

		return {
			buyer,
			seller,
		} as const;
	});
