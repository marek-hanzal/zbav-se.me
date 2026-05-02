import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log/getLoggerFx";
import type { ValidationErrorSchema, ValidationResultSchema } from "@/lib/common/schema";
import { ListingSchema } from "../schema/ListingSchema";
import { listingFetchFx } from "./listingFetchFx";

export namespace listingValidateFx {
	export interface Props {
		userId: string;
		listingId: string;
	}
}

export const listingValidateFx = Effect.fn("listingValidateFx")(function* ({
	userId,
	listingId,
}: listingValidateFx.Props) {
	const logger = yield* getLoggerFx("listingValidateFx");
	logger.trace("listingValidateFx", {
		listingId,
	});

	const listing = yield* listingFetchFx({
		userId,
		where: {
			id: listingId,
		},
		scope: {
			userId,
		},
	});

	const result = {
		errors: [],
		success: true,
	} as {
		errors: ValidationErrorSchema.Type[];
		success: boolean;
	};

	{
		{
			if (!listing.withUploadIds.length) {
				result.errors.push({
					field: "gallery",
					message: "Missing images",
				});
			}
		}

		{
			const data = ListingSchema.shape.title.safeParse(listing.title);
			if (!listing.title || !data.success) {
				result.errors.push({
					field: "title",
					message: "Title is not filled properly",
				});
			}
		}

		{
			if (!listing.categoryId) {
				result.errors.push({
					field: "categoryId",
					message: "Missing category",
				});
			}
		}

		{
			if (!listing.locationId) {
				result.errors.push({
					field: "locationId",
					message: "Missing location",
				});
			}
		}

		{
			if (!listing.priceType) {
				result.errors.push({
					field: "priceType",
					message: "Missing price type",
				});
			}
		}

		{
			if (!listing.expires) {
				result.errors.push({
					field: "expires",
					message: "Missing expiration time",
				});
			}
		}
	}

	result.success = !result.errors.length;

	return result satisfies ValidationResultSchema.Type;
});

export type listingValidateFx = ReturnType<typeof listingValidateFx>;
