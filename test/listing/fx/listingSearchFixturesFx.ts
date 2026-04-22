import { Effect } from "effect";
import { sql } from "kysely";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import type { ListingDeliveryEnumSchema } from "~/common/listing/enum/ListingDeliveryEnumSchema";
import type { ListingStatusEnumSchema } from "~/common/listing/enum/ListingStatusEnumSchema";
import type { ListingWarrantyEnumSchema } from "~/common/listing/enum/ListingWarrantyEnumSchema";
import type { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import type { testabase } from "~/test/testabase";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;
type LocationFixture = {
	id: string;
	query: string;
	county: string;
	municipality: string;
	state: string;
	address: string;
	city: string;
	zip: string;
	hash: string;
	lat: number;
	lon: number;
};
type ListingSearchPatch = {
	id: string;
	locationId?: string;
	price?: number;
	condition?: number;
	age?: number;
	delivery?: ListingDeliveryEnumSchema.Type[];
	warranty?: ListingWarrantyEnumSchema.Type;
	status?: ListingStatusEnumSchema.Type;
	restriction?: RestrictionEnumSchema.Type;
};

export const personalDelivery: ListingDeliveryEnumSchema.Type[] = [
	"personal",
];

export const postDelivery: ListingDeliveryEnumSchema.Type[] = [
	"post",
];

export const seedLocationFixtureFx = (database: TestDatabase, location: LocationFixture) =>
	Effect.promise(() =>
		database.kysely
			.insertInto("location")
			.values({
				id: location.id,
				query: location.query,
				lang: "cs",
				country: "Cesko",
				code: "CZ",
				county: location.county,
				municipality: location.municipality,
				state: location.state,
				address: location.address,
				city: location.city,
				street: null,
				zip: location.zip,
				confidence: 0.98,
				hash: location.hash,
				lat: location.lat,
				lon: location.lon,
				geo: sql`default`,
			})
			.onConflict((oc) =>
				oc
					.columns([
						"lang",
						"hash",
					])
					.doNothing(),
			)
			.execute(),
	);

export const patchListingSearchFixtureFx = (database: TestDatabase, props: ListingSearchPatch) =>
	Effect.promise(() =>
		database.kysely
			.updateTable("listing")
			.set({
				...(props.locationId !== undefined
					? {
							locationId: props.locationId,
						}
					: {}),
				...(props.price !== undefined
					? {
							price: props.price,
						}
					: {}),
				...(props.condition !== undefined
					? {
							condition: props.condition,
						}
					: {}),
				...(props.age !== undefined
					? {
							age: props.age,
						}
					: {}),
				...(props.delivery !== undefined
					? {
							delivery: props.delivery,
						}
					: {}),
				...(props.warranty !== undefined
					? {
							warranty: props.warranty,
						}
					: {}),
				...(props.status !== undefined
					? {
							status: props.status,
						}
					: {}),
				...(props.restriction !== undefined
					? {
							restriction: props.restriction,
						}
					: {}),
			})
			.where("id", "=", props.id)
			.executeTakeFirstOrThrow(),
	);

export const patchCategoryDiscoveryFx = (
	database: TestDatabase,
	props: {
		id: string;
		discovery: "explicit" | "implicit";
	},
) =>
	Effect.promise(() =>
		database.kysely
			.updateTable("category")
			.set({
				discovery: props.discovery,
			})
			.where("id", "=", props.id)
			.executeTakeFirstOrThrow(),
	);

export const categoryIdBySlugFx = (database: TestDatabase, slug: string) =>
	Effect.promise(() =>
		database.kysely
			.selectFrom("category")
			.select("id")
			.where("slug", "=", slug)
			.executeTakeFirstOrThrow(),
	);

export const createRestrictedCategoryFx = (
	database: TestDatabase,
	props: {
		slug: string;
		restriction: RestrictionEnumSchema.Type;
	},
) =>
	Effect.promise(async () => {
		const category = {
			id: genId(),
			group: "Listing restriction fixture",
			category: `Listing restriction ${props.restriction}`,
			slug: props.slug,
			sort: 0,
			locale: "cs",
			discovery: "implicit" as const,
			restriction: props.restriction,
		};

		await database.kysely.insertInto("category").values(category).execute();

		return category;
	});

export const createUserRestrictionFx = (
	database: TestDatabase,
	props: {
		userId: string;
		restriction: RestrictionEnumSchema.Type;
	},
) =>
	Effect.gen(function* () {
		const dateContext = yield* DateContextFx;
		const now = dateContext.now();

		yield* Effect.promise(() =>
			database.kysely
				.insertInto("user_restriction")
				.values({
					id: genId(),
					userId: props.userId,
					restriction: props.restriction,
					availableAt: now
						.minus({
							minutes: 10,
						})
						.toJSDate(),
					createdAt: now
						.minus({
							minutes: 10,
						})
						.toJSDate(),
				})
				.execute(),
		);
	});
