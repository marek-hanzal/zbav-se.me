import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import { InvalidRequestError } from "../../../error/InvalidRequestError";
import { listingScoreCreateFx } from "../../listing-score/service/listingScoreCreateFx";
import type { ListingFlagToggleSchema } from "../schema/ListingFlagToggleSchema";
import { listingFlagCreateFx } from "./listingFlagCreateFx";
import { listingFlagDeleteFx } from "./listingFlagDeleteFx";

export namespace listingFlagToggleFx {
	export interface Props {
		database: WithDatabase;
		userId: string;
		data: ListingFlagToggleSchema.Type;
	}
}

export const listingFlagToggleFx = ({
	database,
	userId,
	data: { toggle, listingId },
}: listingFlagToggleFx.Props) => {
	return Effect.gen(function* () {
		if (toggle) {
			const listing = yield* Effect.promise(async () => {
				return database
					.selectFrom("listing")
					.select("id")
					.where("id", "=", listingId)
					.where("userId", "=", userId)
					.executeTakeFirst();
			});

			if (listing) {
				return yield* Effect.fail(
					new InvalidRequestError({
						message: "You cannot flag your own listing",
					}),
				);
			}

			yield* listingFlagCreateFx({
				database,
				userId,
				listingId,
			});

			return yield* listingScoreCreateFx({
				database,
				userId,
				listingId,
				score: "flag",
			});
		}

		return yield* listingFlagDeleteFx({
			database,
			userId,
			listingId,
		});
	});
};

export type listingFlagToggleFx = ReturnType<typeof listingFlagToggleFx>;
