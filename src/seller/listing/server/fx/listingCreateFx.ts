import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import type { ListingCreateSchema } from "~/seller/listing/server/schema/ListingCreateSchema";

export namespace listingCreateFx {
	export interface Props extends ListingCreateSchema.Type {
		userId: string;
	}
}

export const listingCreateFx = Effect.fn("listingCreateFx")(function* ({
	userId,
	...data
}: listingCreateFx.Props) {
	const logger = yield* getLoggerFx("listingCreateFx");
	logger.trace("listingCreateFx", {
		userId,
		...data,
	});

	throw new Error("Listing creation is not supported. Use draftCreateFx instead.");
});

export type listingCreateFx = ReturnType<typeof listingCreateFx>;
