import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { listingCheckIfOwnFx } from "~/buyer/listing/server/fx/listingCheckIfOwnFx";
import { listingFetchFx } from "~/buyer/listing/server/fx/listingFetchFx";
import { listingEventRateLimitFx } from "~/buyer/listing-event/server/fx/listingEventRateLimitFx";
import type { ListingEventCreateSchema } from "~/buyer/listing-event/server/schema/ListingEventCreateSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export namespace listingEventCreateFx {
	export interface Props extends ListingEventCreateSchema.Type {
		userId: string;
		checkVisibility?: boolean;
	}
}

export const listingEventCreateFx = Effect.fn("listingEventCreateFx")(function* ({
	userId,
	listingId,
	event,
	checkVisibility = true,
}: listingEventCreateFx.Props) {
	const logger = yield* getLoggerFx("listingEventCreateFx");
	logger.trace("listingEventCreateFx", {
		userId,
		listingId,
		event,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

			yield* listingCheckIfOwnFx({
				userId,
				listingId,
				message: "You cannot generate event on your own listing.",
			});

			if (checkVisibility) {
				yield* listingFetchFx({
					userId,
					where: {
						id: listingId,
					},
					scope: {},
				});
			}

			const now = dateContext.now();

			yield* listingEventRateLimitFx({
				listingId,
				event,
			});

			return yield* tryDbFx(async () =>
				kysely
					.insertInto("listing_event")
					.values({
						id: genId(),
						listingId,
						event,
						createdAt: now.toJSDate(),
					})
					.returningAll()
					.executeTakeFirstOrThrow(),
			);
		}),
	);
});

export type listingEventCreateFx = ReturnType<typeof listingEventCreateFx>;
