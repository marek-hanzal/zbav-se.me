import { Effect } from "effect";
import { DateTime } from "luxon";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import type { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";
import type { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

interface UserResourceLimitInsert {
	id: string;
	userId: string;
	resourceDefinitionId: ResourceDefinitionEnumSchema.Type;
	reference: string | null;
	createdAt: Date;
	availableAt: Date;
	expiresAt: Date | null;
	limit: number;
}

const date = (iso: string) => new Date(iso);

const limitRow = (
	userId: string,
	resourceDefinitionId: ResourceDefinitionEnumSchema.Type,
	reference: string | null,
	availableAt: string,
	createdAt: string,
	expiresAt: string | null,
	limit: number,
): UserResourceLimitInsert => ({
	id: genId(),
	userId,
	resourceDefinitionId,
	reference,
	createdAt: date(createdAt),
	availableAt: date(availableAt),
	expiresAt: expiresAt ? date(expiresAt) : null,
	limit,
});

export const atUserResourceLimitReadModelFx = <A, E, R>(iso: string, eff: Effect.Effect<A, E, R>) =>
	eff.pipe(
		Effect.provideService(DateContextFx, {
			now: () => DateTime.fromISO(iso),
		}),
	);

export const seedUserResourceLimitReadModelFx = (database: TestDatabase) =>
	Effect.gen(function* () {
		const { seller, buyer } = yield* createUsersFx({});

		yield* Effect.promise(() =>
			database.kysely
				.insertInto("user_resource_limit")
				.values([
					limitRow(
						seller.id,
						"listing.count",
						null,
						"2026-05-10T08:00:00.000Z",
						"2026-05-10T08:00:00.000Z",
						null,
						2,
					),
					limitRow(
						seller.id,
						"listing.count",
						null,
						"2026-05-12T08:00:00.000Z",
						"2026-05-12T08:30:00.000Z",
						null,
						3,
					),
					limitRow(
						seller.id,
						"listing.count",
						null,
						"2026-05-12T08:00:00.000Z",
						"2026-05-12T08:45:00.000Z",
						null,
						7,
					),
					limitRow(
						seller.id,
						"listing.count",
						null,
						"2026-05-11T08:00:00.000Z",
						"2026-05-11T08:30:00.000Z",
						"2026-05-12T09:00:00.000Z",
						1,
					),
					limitRow(
						seller.id,
						"listing.count",
						null,
						"2026-05-13T08:00:00.000Z",
						"2026-05-13T08:30:00.000Z",
						null,
						99,
					),
					limitRow(
						seller.id,
						"feed.count",
						null,
						"2026-05-10T09:00:00.000Z",
						"2026-05-10T09:00:00.000Z",
						null,
						4,
					),
					limitRow(
						seller.id,
						"feed.count",
						"draft-1",
						"2026-05-11T09:00:00.000Z",
						"2026-05-11T09:00:00.000Z",
						null,
						14,
					),
					limitRow(
						seller.id,
						"feed.count",
						"draft-1",
						"2026-05-11T09:00:00.000Z",
						"2026-05-11T09:30:00.000Z",
						null,
						16,
					),
					limitRow(
						seller.id,
						"feed.count",
						"draft-2",
						"2026-05-11T09:00:00.000Z",
						"2026-05-11T09:00:00.000Z",
						null,
						24,
					),
					limitRow(
						seller.id,
						"feed.count",
						null,
						"2026-05-13T09:00:00.000Z",
						"2026-05-13T09:00:00.000Z",
						null,
						44,
					),
					limitRow(
						seller.id,
						"listing.gallery.count",
						null,
						"2026-05-10T10:00:00.000Z",
						"2026-05-10T10:00:00.000Z",
						null,
						10,
					),
					limitRow(
						seller.id,
						"listing.gallery.count",
						"draft-1",
						"2026-05-11T10:00:00.000Z",
						"2026-05-11T10:00:00.000Z",
						"2026-05-12T12:00:00.000Z",
						20,
					),
					limitRow(
						seller.id,
						"listing.gallery.count",
						"draft-1",
						"2026-05-11T10:00:00.000Z",
						"2026-05-11T10:30:00.000Z",
						"2026-05-12T11:00:00.000Z",
						15,
					),
					limitRow(
						seller.id,
						"listing.gallery.count",
						"draft-1",
						"2026-05-12T11:30:00.000Z",
						"2026-05-12T11:30:00.000Z",
						null,
						25,
					),
					limitRow(
						seller.id,
						"listing.gallery.count",
						"draft-2",
						"2026-05-11T11:00:00.000Z",
						"2026-05-11T11:00:00.000Z",
						null,
						18,
					),
					limitRow(
						seller.id,
						"listing.gallery.count",
						"draft-2",
						"2026-05-11T11:00:00.000Z",
						"2026-05-11T11:30:00.000Z",
						null,
						19,
					),
					limitRow(
						seller.id,
						"listing.gallery.count",
						"draft-2",
						"2026-05-12T09:30:00.000Z",
						"2026-05-12T09:30:00.000Z",
						"2026-05-12T09:45:00.000Z",
						21,
					),
					limitRow(
						seller.id,
						"listing.gallery.count",
						"draft-2",
						"2026-05-13T11:00:00.000Z",
						"2026-05-13T11:00:00.000Z",
						null,
						22,
					),
					limitRow(
						seller.id,
						"listing.gallery.count",
						"draft-3",
						"2026-05-10T11:00:00.000Z",
						"2026-05-10T11:00:00.000Z",
						null,
						12,
					),
					limitRow(
						seller.id,
						"listing.gallery.count",
						"draft-3",
						"2026-05-11T11:00:00.000Z",
						"2026-05-11T11:00:00.000Z",
						null,
						13,
					),
					limitRow(
						seller.id,
						"listing.gallery.count",
						"draft-3",
						"2026-05-11T11:00:00.000Z",
						"2026-05-11T11:05:00.000Z",
						null,
						14,
					),
					limitRow(
						seller.id,
						"listing.gallery.count",
						"draft-expired",
						"2026-05-11T11:00:00.000Z",
						"2026-05-11T11:00:00.000Z",
						"2026-05-12T09:00:00.000Z",
						40,
					),
					limitRow(
						seller.id,
						"listing.gallery.count",
						"draft-future",
						"2026-05-12T11:30:00.000Z",
						"2026-05-12T11:30:00.000Z",
						null,
						30,
					),
					limitRow(
						buyer.id,
						"feed.count",
						null,
						"2026-05-10T12:00:00.000Z",
						"2026-05-10T12:00:00.000Z",
						null,
						1,
					),
					limitRow(
						buyer.id,
						"listing.gallery.count",
						"draft-1",
						"2026-05-10T12:00:00.000Z",
						"2026-05-10T12:00:00.000Z",
						null,
						666,
					),
				])
				.execute(),
		);

		return {
			buyer,
			seller,
		} as const;
	});
