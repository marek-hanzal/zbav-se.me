import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import { InvalidRequestError } from "../../../error/InvalidRequestError";

export namespace listingFlagCreateFx {
	export interface Props {
		database: WithDatabase;
		userId: string;
		listingId: string;
		createdAt?: Date;
	}
}

export const listingFlagCreateFx = ({
	database,
	userId,
	listingId,
	createdAt = new Date(),
}: listingFlagCreateFx.Props) => {
	return Effect.gen(function* () {
		const id = genId();

		return yield* Effect.tryPromise({
			async try() {
				return database
					.insertInto("listing_flag")
					.values({
						id,
						userId,
						listingId,
						createdAt,
					})
					.returningAll()
					.executeTakeFirst();
			},
			catch() {
				return new InvalidRequestError({
					message: "You have already flagged this listing",
				});
			},
		});
	});
};

export type listingFlagCreateFx = ReturnType<typeof listingFlagCreateFx>;
