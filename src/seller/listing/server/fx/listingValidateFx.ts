import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log/getLoggerFx";
import type { ValidationErrorSchema } from "@/lib/common/schema";
import { listingFetchFx } from "~/buyer/listing/server/fx/listingFetchFx";
import { ListingSchema } from "../schema/ListingSchema";

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
		const data = ListingSchema.safeParse(listing.title);
		if (!listing.title || !data.success) {
			result.errors.push({
				field: "title",
				message: "Title is not filled properly",
			});
			result.success = false;
		}
	}

	return result as
		| {
				success: true;
		  }
		| {
				errors: [
					ValidationErrorSchema.Type,
					...ValidationErrorSchema.Type[],
				];
				success: false;
		  };
});

export type listingValidateFx = ReturnType<typeof listingValidateFx>;
