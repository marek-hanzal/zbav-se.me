import { Effect } from "effect";
import { DateTime } from "luxon";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import type { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";
import type { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

interface ResourceBundleLimitSeed {
	userId: string;
	resourceDefinitionId: ResourceDefinitionEnumSchema.Type;
	availableAt: string;
	createdAt: string;
	expiresAt: string | null;
	limit: number;
}

const date = (iso: string) => new Date(iso);

const limitSeed = (
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
		Effect.provideService(DateContextFx, {
			now: () => DateTime.fromISO(iso),
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
			limitSeed(
				seller.id,
				"listing.count",
				"2026-05-10T08:00:00.000Z",
				"2026-05-10T08:00:00.000Z",
				null,
				2,
			),
			limitSeed(
				seller.id,
				"listing.count",
				"2026-05-12T08:00:00.000Z",
				"2026-05-12T08:45:00.000Z",
				null,
				7,
			),
			limitSeed(
				seller.id,
				"listing.count",
				"2026-05-13T08:00:00.000Z",
				"2026-05-13T08:30:00.000Z",
				null,
				99,
			),
			limitSeed(
				seller.id,
				"feed.count",
				"2026-05-10T09:00:00.000Z",
				"2026-05-10T09:00:00.000Z",
				null,
				4,
			),
			limitSeed(
				seller.id,
				"listing.gallery.count",
				"2026-05-10T10:00:00.000Z",
				"2026-05-10T10:00:00.000Z",
				null,
				10,
			),
			limitSeed(
				seller.id,
				"listing.gallery.count",
				"2026-05-12T11:30:00.000Z",
				"2026-05-12T11:30:00.000Z",
				null,
				25,
			),
			limitSeed(
				buyer.id,
				"feed.count",
				"2026-05-10T12:00:00.000Z",
				"2026-05-10T12:00:00.000Z",
				null,
				1,
			),
			limitSeed(
				buyer.id,
				"listing.gallery.count",
				"2026-05-10T12:00:00.000Z",
				"2026-05-10T12:00:00.000Z",
				null,
				666,
			),
		];

		yield* Effect.promise(async () => {
			for (const seed of seeds) {
				const resourceBundleId = genId();

				await database.kysely
					.insertInto("resource_bundle")
					.values({
						id: resourceBundleId,
						name: `Test bundle ${resourceBundleId}`,
					})
					.execute();

				await database.kysely
					.insertInto("resource_bundle_limit")
					.values({
						id: genId(),
						resourceBundleId,
						resourceDefinitionId: seed.resourceDefinitionId,
						limit: seed.limit,
					})
					.execute();

				await database.kysely
					.insertInto("user_resource_bundle")
					.values({
						id: genId(),
						userId: seed.userId,
						resourceBundleId,
						createdAt: date(seed.createdAt),
						availableAt: date(seed.availableAt),
						expiresAt: seed.expiresAt ? date(seed.expiresAt) : null,
					})
					.execute();
			}
		});

		return {
			buyer,
			seller,
		} as const;
	});
