import { Effect } from "effect";
import { sql } from "kysely";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import type { DeliveryEnumSchema } from "~/common/delivery/enum/DeliveryEnumSchema";
import type { ListingStatusEnumSchema } from "~/common/listing/enum/ListingStatusEnumSchema";
import type { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import type { WarrantyEnumSchema } from "~/common/warranty/enum/WarrantyEnumSchema";
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
	categoryId?: string;
	price?: number;
	condition?: number;
	age?: number;
	delivery?: DeliveryEnumSchema.Type[];
	warranty?: WarrantyEnumSchema.Type;
	status?: ListingStatusEnumSchema.Type;
	restriction?: RestrictionEnumSchema.Type;
	title?: string;
};

export const personalDelivery: DeliveryEnumSchema.Type[] = [
	"personal",
];

export const postDelivery: DeliveryEnumSchema.Type[] = [
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
	Effect.promise(async () => {
		const values: Record<string, unknown> = {};

		if (props.locationId !== undefined) {
			const location = await database.kysely
				.selectFrom("location")
				.select("geo")
				.where("id", "=", props.locationId)
				.executeTakeFirstOrThrow();

			values.locationId = props.locationId;
			values.withLocation = location.geo;
		}

		if (props.categoryId !== undefined) {
			values.categoryId = props.categoryId;
		}

		if (props.price !== undefined) {
			values.price = props.price;
		}

		if (props.condition !== undefined) {
			values.condition = props.condition;
		}

		if (props.age !== undefined) {
			values.age = props.age;
		}

		if (props.delivery !== undefined) {
			values.delivery = props.delivery;
		}

		if (props.warranty !== undefined) {
			values.warranty = props.warranty;
		}

		if (props.status !== undefined) {
			values.status = props.status;
		}

		if (props.restriction !== undefined) {
			values.restriction = props.restriction;
		}

		if (props.title !== undefined) {
			values.title = props.title;
			values.withTitle = sql`lower(immutable_unaccent(${props.title}))`;
		}

		return database.kysely
			.updateTable("listing")
			.set(values)
			.where("id", "=", props.id)
			.executeTakeFirstOrThrow();
	});

export const patchCategoryDiscoveryFx = (
	database: TestDatabase,
	props: {
		id: string;
		discovery: "explicit" | "implicit";
	},
) => {
	return Effect.promise(async () => {
		await database.kysely
			.updateTable("category")
			.set({
				discovery: props.discovery,
			})
			.where("id", "=", props.id)
			.executeTakeFirstOrThrow();
	});
};

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
					expiresAt: null,
					createdAt: now
						.minus({
							minutes: 10,
						})
						.toJSDate(),
				})
				.execute(),
		);
	});
