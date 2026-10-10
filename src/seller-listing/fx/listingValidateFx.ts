import { Effect } from "effect";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { draftFetchFx } from "~/seller-draft/fx/draftFetchFx";
import { ListingSchema } from "~/seller-listing/schema/ListingSchema";
import type { ValidationErrorSchema } from "~/validation/schema/ValidationErrorSchema";
import type { ValidationResultSchema } from "~/validation/schema/ValidationResultSchema";

export namespace listingValidateFx {
	export interface Props {
		userId: string;
		draftId: string;
	}
}

export const listingValidateFx = Effect.fn("listingValidateFx")(function* ({
	userId,
	draftId,
}: listingValidateFx.Props) {
	const logger = yield* getLoggerFx("listingValidateFx");
	logger.trace("listingValidateFx", {
		draftId,
	});

	const draft = yield* draftFetchFx({
		userId,
		where: {
			id: draftId,
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
			if (!draft.withUploadIds.length) {
				result.errors.push({
					field: "gallery",
					message: "Missing images",
				});
			}
		}

		{
			const data = ListingSchema.shape.title.safeParse(draft.title);
			if (!draft.title || !data.success) {
				result.errors.push({
					field: "title",
					message: "Title is not filled properly",
				});
			}
		}

		{
			if (!draft.categoryId) {
				result.errors.push({
					field: "categoryId",
					message: "Missing category",
				});
			}
		}

		{
			if (!draft.locationId) {
				result.errors.push({
					field: "locationId",
					message: "Missing location",
				});
			}
		}

		{
			if (!draft.priceType) {
				result.errors.push({
					field: "priceType",
					message: "Missing price type",
				});
			}
		}

		{
			if (!draft.expires) {
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
