import { Effect } from "effect";
import { type ExpressionBuilder, sql } from "kysely";
import type { DateTime } from "luxon";
import { DateServiceFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { keyOf } from "@/lib/common/key-of/keyOf";
import type { ListingExpireEnumSchema } from "~/common/listing/enum/ListingExpireEnumSchema";
import type { GalleryItemTableSchema } from "~/server/database/@table/GalleryItemTableSchema";
import type { GalleryTableSchema } from "~/server/database/@table/GalleryTableSchema";
import type { ListingAttrDecimalTableSchema } from "~/server/database/@table/ListingAttrDecimalTableSchema";
import type { ListingAttrEnumMultiTableSchema } from "~/server/database/@table/ListingAttrEnumMultiTableSchema";
import type { ListingAttrEnumSingleTableSchema } from "~/server/database/@table/ListingAttrEnumSingleTableSchema";
import type { ListingAttrNumberTableSchema } from "~/server/database/@table/ListingAttrNumberTableSchema";
import type { ListingAttrTextTableSchema } from "~/server/database/@table/ListingAttrTextTableSchema";
import type { ListingSpotlightTableSchema } from "~/server/database/@table/ListingSpotlightTableSchema";
import type { UserEventTableSchema } from "~/server/database/@table/UserEventTableSchema";
import type { Database } from "~/server/database/Database";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { RuntimeErrorFx } from "~/server/error/RuntimeErrorFx";
import type { SeedListingPlan } from "./listingSeedPlanFx";
import { buildListingSeedSpotlightRows } from "./listingSeedSpotlight";

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

const withChunks = <T>(rows: readonly T[]) => {
	const chunks: T[][] = [];

	for (let index = 0; index < rows.length; index += INSERT_CHUNK_SIZE) {
		chunks.push(rows.slice(index, index + INSERT_CHUNK_SIZE));
	}

	return chunks;
};

const toExpiresAt = (now: DateTime, expires: ListingExpireEnumSchema.Type) => {
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
	onChunkInserted,
}: {
	table: TableName;
	rows: readonly unknown[];
	onConflictDoNothing?: boolean;
	onChunkInserted?: (input: {
		table: TableName;
		chunkIndex: number;
		chunkCount: number;
		insertedRowCount: number;
	}) => Effect.Effect<void>;
}) {
	if (rows.length === 0) {
		return;
	}

	const chunks = withChunks(rows);

	for (const [chunkIndex, chunk] of chunks.entries()) {
		yield* dbFx(async (kysely) => {
			let query = kysely.insertInto(table).values(chunk as never);

			if (onConflictDoNothing) {
				query = query.onConflict((oc) => oc.doNothing());
			}

			await query.execute();
		});

		if (onChunkInserted) {
			yield* onChunkInserted({
				table,
				chunkIndex,
				chunkCount: chunks.length,
				insertedRowCount: chunk.length,
			});
		}

		yield* Effect.yieldNow();
	}
});

export namespace listingSeedPublishFx {
	export interface Props {
		userId: string;
		plans: SeedListingPlan[];
		onProgress?: (input: {
			message: string;
			delta: number;
			createdCount?: number;
		}) => Effect.Effect<void>;
	}
}

export const listingSeedPublishFx = Effect.fn("listingSeedPublishFx")(function* ({
	userId,
	plans,
	onProgress,
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
	const now = dateService.now();
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
			id: genId(),
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
				id: genId(),
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
			expiresAt: toExpiresAt(now, plan.expires).toJSDate(),
		});

		listingAttrDecimalRows.push(...plan.attrs.decimal);
		listingAttrNumberRows.push(...plan.attrs.number);
		listingAttrEnumSingleRows.push(...plan.attrs.enumSingle);
		listingAttrEnumMultiRows.push(...plan.attrs.enumMulti);
		listingAttrTextRows.push(...plan.attrs.text);
		listingSpotlightRows.push(
			...buildListingSeedSpotlightRows({
				listingId: plan.listingId,
				title: plan.title,
				description: plan.description,
				pros: plan.pros,
				cons: plan.cons,
			}),
		);
		userEventRows.push({
			id: genId(),
			userId,
			scope: "user",
			source: "listing",
			group: keyOf(plan.listingId),
			event: "listing.create",
			isTerminal: true,
			createdAt: now.toJSDate(),
		});

		if (
			onProgress &&
			((planIndex + 1) % payloadLogInterval === 0 || planIndex + 1 === plans.length)
		) {
			yield* onProgress({
				message: `Publish payload ${planIndex + 1}/${plans.length}: ${plan.title}`,
				delta:
					planIndex + 1 === plans.length
						? plans.length % payloadLogInterval || payloadLogInterval
						: payloadLogInterval,
			});
		}

		if ((planIndex + 1) % PUBLISH_YIELD_INTERVAL === 0) {
			yield* Effect.yieldNow();
		}
	}

	let createdCount = 0;

	const withChunkProgress = <TableName extends keyof Database>(table: TableName) => {
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
				if (!onProgress) {
					return;
				}

				if (table === "listing") {
					createdCount += insertedRowCount;
				}

				yield* onProgress({
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
				onChunkInserted: withChunkProgress("gallery"),
			});
			yield* insertChunkedRowsFx({
				table: "upload",
				rows: uploadRows,
				onChunkInserted: withChunkProgress("upload"),
			});
			yield* insertChunkedRowsFx({
				table: "gallery_item",
				rows: galleryItemRows,
				onChunkInserted: withChunkProgress("gallery_item"),
			});
			yield* insertChunkedRowsFx({
				table: "listing",
				rows: listingRows,
				onChunkInserted: withChunkProgress("listing"),
			});
			yield* insertChunkedRowsFx({
				table: "listing_attr_decimal",
				rows: listingAttrDecimalRows,
				onChunkInserted: withChunkProgress("listing_attr_decimal"),
			});
			yield* insertChunkedRowsFx({
				table: "listing_attr_number",
				rows: listingAttrNumberRows,
				onChunkInserted: withChunkProgress("listing_attr_number"),
			});
			yield* insertChunkedRowsFx({
				table: "listing_attr_enum_single",
				rows: listingAttrEnumSingleRows,
				onChunkInserted: withChunkProgress("listing_attr_enum_single"),
			});
			yield* insertChunkedRowsFx({
				table: "listing_attr_enum_multi",
				rows: listingAttrEnumMultiRows,
				onChunkInserted: withChunkProgress("listing_attr_enum_multi"),
			});
			yield* insertChunkedRowsFx({
				table: "listing_attr_text",
				rows: listingAttrTextRows,
				onChunkInserted: withChunkProgress("listing_attr_text"),
			});
			yield* insertChunkedRowsFx({
				table: "listing_spotlight",
				rows: listingSpotlightRows,
				onConflictDoNothing: true,
				onChunkInserted: withChunkProgress("listing_spotlight"),
			});
			yield* insertChunkedRowsFx({
				table: "user_event",
				rows: userEventRows,
				onChunkInserted: withChunkProgress("user_event"),
			});
		}),
	);
});
