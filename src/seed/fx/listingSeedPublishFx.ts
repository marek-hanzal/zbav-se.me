import { Effect } from "effect";
import { type ExpressionBuilder, sql } from "kysely";
import type { DateTime } from "luxon";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import type { GalleryItemTableSchema } from "~/database/schema/GalleryItemTableSchema";
import type { GalleryTableSchema } from "~/database/schema/GalleryTableSchema";
import type { ListingAttrDecimalTableSchema } from "~/database/schema/ListingAttrDecimalTableSchema";
import type { ListingAttrEnumMultiTableSchema } from "~/database/schema/ListingAttrEnumMultiTableSchema";
import type { ListingAttrEnumSingleTableSchema } from "~/database/schema/ListingAttrEnumSingleTableSchema";
import type { ListingAttrNumberTableSchema } from "~/database/schema/ListingAttrNumberTableSchema";
import type { ListingAttrTextTableSchema } from "~/database/schema/ListingAttrTextTableSchema";
import type { ListingSpotlightTableSchema } from "~/database/schema/ListingSpotlightTableSchema";
import type { UserEventTableSchema } from "~/database/schema/UserEventTableSchema";
import type { Database } from "~/database/type/Database";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { keyOfFn } from "~/hash/fn/keyOfFn";
import { genIdFn } from "~/identity/fn/genIdFn";
import type { ListingExpireEnumSchema } from "~/listing/schema/ListingExpireEnumSchema";
import { buildListingSeedSpotlightRowsFn } from "~/seed/fn/listingSeedSpotlight";
import type { SeedListingPlan } from "~/seed/fx/listingSeedPlanFx";
import { RuntimeErrorFx } from "~/server-error/error/RuntimeErrorFx";

const INSERT_CHUNK_SIZE = 1000;
const PAYLOAD_PROGRESS_LOG_TARGET = 20;
const PUBLISH_YIELD_INTERVAL = 1000;

type GalleryInsertRow = GalleryTableSchema.Type;
type GalleryItemInsertRow = GalleryItemTableSchema.Type;
type ListingAttrDecimalInsertRow = ListingAttrDecimalTableSchema.Type;
type ListingAttrNumberInsertRow = ListingAttrNumberTableSchema.Type;
type ListingAttrEnumSingleInsertRow = ListingAttrEnumSingleTableSchema.Type;
type ListingAttrEnumMultiInsertRow = ListingAttrEnumMultiTableSchema.Type;
type ListingAttrTextInsertRow = ListingAttrTextTableSchema.Type;
type ListingSpotlightInsertRow = ListingSpotlightTableSchema.Type;
type UserEventInsertRow = UserEventTableSchema.Type;
type UploadInsertRow = Database["upload"];

type ListingInsertRow = {
	id: string;
	userId: string;
	status: "live";
	restriction: SeedListingPlan["restriction"];
	categoryId: string;
	galleryId: string;
	withUploadIds: [
		string,
		...string[],
	];
	withImageUrl: [
		string,
		...string[],
	];
	title: string;
	withTitle: ReturnType<ExpressionBuilder<Database, "listing">["val"]> | ReturnType<typeof sql>;
	description: string;
	priceType: SeedListingPlan["priceType"];
	price: number;
	currency: SeedListingPlan["currency"];
	expires: SeedListingPlan["expires"];
	condition: number;
	age: number;
	delivery: SeedListingPlan["delivery"];
	warranty: SeedListingPlan["warranty"];
	locationId: string;
	withLocation: string;
	pros: string[];
	cons: string[];
	createdAt: Date;
	updatedAt: Date;
	visibleAt: Date;
	expiresAt: Date;
};

const withChunksFn = <T>(rows: readonly T[]) => {
	const chunks: T[][] = [];

	for (let index = 0; index < rows.length; index += INSERT_CHUNK_SIZE) {
		chunks.push(rows.slice(index, index + INSERT_CHUNK_SIZE));
	}

	return chunks;
};

const toExpiresAtFn = (now: DateTime, expires: ListingExpireEnumSchema.Type) => {
	switch (expires) {
		case "7-days": {
			return now.plus({
				days: 7,
			});
		}
		case "14-days": {
			return now.plus({
				days: 14,
			});
		}
		case "1-month": {
			return now.plus({
				month: 1,
			});
		}
	}
};

const insertChunkedRowsFx = Effect.fn("insertChunkedRowsFx")(function* <
	TableName extends keyof Database,
>({
	table,
	rows,
	onConflictDoNothing = false,
	onChunkInsertedFx,
}: {
	table: TableName;
	rows: readonly unknown[];
	onConflictDoNothing?: boolean;
	onChunkInsertedFx?: (input: {
		table: TableName;
		chunkIndex: number;
		chunkCount: number;
		insertedRowCount: number;
	}) => Effect.Effect<void>;
}) {
	if (rows.length === 0) {
		return;
	}

	const chunks = withChunksFn(rows);

	for (const [chunkIndex, chunk] of chunks.entries()) {
		yield* dbFx(async (kysely) => {
			let query = kysely.insertInto(table).values(chunk as never);

			if (onConflictDoNothing) {
				query = query.onConflict((oc) => oc.doNothing());
			}

			await query.execute();
		});

		if (onChunkInsertedFx) {
			yield* onChunkInsertedFx({
				table,
				chunkIndex,
				chunkCount: chunks.length,
				insertedRowCount: chunk.length,
			});
		}

		yield* Effect.yieldNow;
	}
});

export namespace listingSeedPublishFx {
	export interface Props {
		userId: string;
		plans: SeedListingPlan[];
		onProgressFx?: (input: {
			message: string;
			delta: number;
			createdCount?: number;
		}) => Effect.Effect<void>;
	}
}

export const listingSeedPublishFx = Effect.fn("listingSeedPublishFx")(function* ({
	userId,
	plans,
	onProgressFx,
}: listingSeedPublishFx.Props) {
	if (plans.length === 0) {
		return;
	}

	const dateService = yield* DateServiceFx;
	const locationIds = Array.from(
		new Set(
			plans.map((plan) => {
				return plan.locationId;
			}),
		),
	);
	const now = dateService.nowFn();
	const locationRows = yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("location")
			.select([
				"id",
				"geo",
			])
			.where("id", "in", locationIds)
			.execute();
	});
	const locationGeoById = new Map(
		locationRows.map((row) => {
			return [
				row.id,
				row.geo,
			] as const;
		}),
	);
	const galleryRows: GalleryInsertRow[] = [];
	const galleryItemRows: GalleryItemInsertRow[] = [];
	const listingRows: ListingInsertRow[] = [];
	const uploadRows: UploadInsertRow[] = [];
	const listingAttrDecimalRows: ListingAttrDecimalInsertRow[] = [];
	const listingAttrNumberRows: ListingAttrNumberInsertRow[] = [];
	const listingAttrEnumSingleRows: ListingAttrEnumSingleInsertRow[] = [];
	const listingAttrEnumMultiRows: ListingAttrEnumMultiInsertRow[] = [];
	const listingAttrTextRows: ListingAttrTextInsertRow[] = [];
	const listingSpotlightRows: ListingSpotlightInsertRow[] = [];
	const userEventRows: UserEventInsertRow[] = [];
	const payloadLogInterval = Math.max(1, Math.floor(plans.length / PAYLOAD_PROGRESS_LOG_TARGET));

	for (const [planIndex, plan] of plans.entries()) {
		const withLocation = locationGeoById.get(plan.locationId);

		if (!withLocation) {
			return yield* new RuntimeErrorFx({
				message: `Missing location geo for seeded listing ${plan.listingId}.`,
			});
		}

		galleryRows.push({
			id: plan.galleryId,
			userId,
			access: "public",
			createdAt: now.toJSDate(),
		});

		const clonedUploads = plan.sourceUploads.map((upload) => ({
			id: genIdFn(),
			userId,
			url: upload.url,
			access: "public" as const,
			createdAt: now.toJSDate(),
		}));
		const withUploadIds = clonedUploads.map((upload) => upload.id);
		const withImageUrl = clonedUploads.map((upload) => upload.url);

		uploadRows.push(...clonedUploads);

		for (const [sort, upload] of clonedUploads.entries()) {
			galleryItemRows.push({
				id: genIdFn(),
				galleryId: plan.galleryId,
				uploadId: upload.id,
				sort,
				createdAt: now.toJSDate(),
			});
		}

		listingRows.push({
			id: plan.listingId,
			userId,
			status: "live",
			restriction: plan.restriction,
			categoryId: plan.categoryId,
			galleryId: plan.galleryId,
			withUploadIds: withUploadIds as [
				string,
				...string[],
			],
			withImageUrl: withImageUrl as [
				string,
				...string[],
			],
			title: plan.title,
			withTitle: sql`lower(immutable_unaccent(${plan.title}))`,
			description: plan.description,
			priceType: plan.priceType,
			price: plan.price,
			currency: plan.currency,
			expires: plan.expires,
			condition: plan.condition,
			age: plan.age,
			delivery: plan.delivery,
			warranty: plan.warranty,
			locationId: plan.locationId,
			withLocation,
			pros: plan.pros,
			cons: plan.cons,
			createdAt: now.toJSDate(),
			updatedAt: now.toJSDate(),
			visibleAt: now.toJSDate(),
			expiresAt: toExpiresAtFn(now, plan.expires).toJSDate(),
		});

		listingAttrDecimalRows.push(...plan.attrs.decimal);
		listingAttrNumberRows.push(...plan.attrs.number);
		listingAttrEnumSingleRows.push(...plan.attrs.enumSingle);
		listingAttrEnumMultiRows.push(...plan.attrs.enumMulti);
		listingAttrTextRows.push(...plan.attrs.text);
		listingSpotlightRows.push(
			...buildListingSeedSpotlightRowsFn({
				listingId: plan.listingId,
				title: plan.title,
				description: plan.description,
				pros: plan.pros,
				cons: plan.cons,
			}),
		);
		userEventRows.push({
			id: genIdFn(),
			userId,
			scope: "user",
			source: "listing",
			group: keyOfFn(plan.listingId),
			event: "listing.create",
			isTerminal: true,
			createdAt: now.toJSDate(),
		});

		if (
			onProgressFx &&
			((planIndex + 1) % payloadLogInterval === 0 || planIndex + 1 === plans.length)
		) {
			yield* onProgressFx({
				message: `Publish payload ${planIndex + 1}/${plans.length}: ${plan.title}`,
				delta:
					planIndex + 1 === plans.length
						? plans.length % payloadLogInterval || payloadLogInterval
						: payloadLogInterval,
			});
		}

		if ((planIndex + 1) % PUBLISH_YIELD_INTERVAL === 0) {
			yield* Effect.yieldNow;
		}
	}

	let createdCount = 0;

	const withChunkProgressFn = <TableName extends keyof Database>(table: TableName) => {
		return ({
			chunkIndex,
			chunkCount,
			insertedRowCount,
		}: {
			table: TableName;
			chunkIndex: number;
			chunkCount: number;
			insertedRowCount: number;
		}) => {
			return Effect.gen(function* () {
				if (!onProgressFx) {
					return;
				}

				if (table === "listing") {
					createdCount += insertedRowCount;
				}

				yield* onProgressFx({
					message: `DB ${table} chunk ${chunkIndex + 1}/${chunkCount} (${insertedRowCount} rows)`,
					delta: 1,
					createdCount: table === "listing" ? createdCount : undefined,
				});
			});
		};
	};

	yield* withTransactionFx(
		Effect.gen(function* () {
			yield* insertChunkedRowsFx({
				table: "gallery",
				rows: galleryRows,
				onChunkInsertedFx: withChunkProgressFn("gallery"),
			});
			yield* insertChunkedRowsFx({
				table: "upload",
				rows: uploadRows,
				onChunkInsertedFx: withChunkProgressFn("upload"),
			});
			yield* insertChunkedRowsFx({
				table: "gallery_item",
				rows: galleryItemRows,
				onChunkInsertedFx: withChunkProgressFn("gallery_item"),
			});
			yield* insertChunkedRowsFx({
				table: "listing",
				rows: listingRows,
				onChunkInsertedFx: withChunkProgressFn("listing"),
			});
			yield* insertChunkedRowsFx({
				table: "listing_attr_decimal",
				rows: listingAttrDecimalRows,
				onChunkInsertedFx: withChunkProgressFn("listing_attr_decimal"),
			});
			yield* insertChunkedRowsFx({
				table: "listing_attr_number",
				rows: listingAttrNumberRows,
				onChunkInsertedFx: withChunkProgressFn("listing_attr_number"),
			});
			yield* insertChunkedRowsFx({
				table: "listing_attr_enum_single",
				rows: listingAttrEnumSingleRows,
				onChunkInsertedFx: withChunkProgressFn("listing_attr_enum_single"),
			});
			yield* insertChunkedRowsFx({
				table: "listing_attr_enum_multi",
				rows: listingAttrEnumMultiRows,
				onChunkInsertedFx: withChunkProgressFn("listing_attr_enum_multi"),
			});
			yield* insertChunkedRowsFx({
				table: "listing_attr_text",
				rows: listingAttrTextRows,
				onChunkInsertedFx: withChunkProgressFn("listing_attr_text"),
			});
			yield* insertChunkedRowsFx({
				table: "listing_spotlight",
				rows: listingSpotlightRows,
				onConflictDoNothing: true,
				onChunkInsertedFx: withChunkProgressFn("listing_spotlight"),
			});
			yield* insertChunkedRowsFx({
				table: "user_event",
				rows: userEventRows,
				onChunkInsertedFx: withChunkProgressFn("user_event"),
			});
		}),
	);
});
