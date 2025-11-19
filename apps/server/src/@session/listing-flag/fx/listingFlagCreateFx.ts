import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { InvalidRequestError } from "../../../error/InvalidRequestError";
import { UserContextFx } from "../../../fx/UserContextFx";

export namespace listingFlagCreateFx {
	export interface Props {
		listingId: string;
		createdAt?: Date;
	}
}

export const listingFlagCreateFx = ({
	listingId,
	createdAt = new Date(),
}: listingFlagCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;
		const id = genId();

		return yield* Effect.tryPromise({
			async try() {
				return database
					.insertInto("listing_flag")
					.values({
						id,
						userId: user.id,
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
