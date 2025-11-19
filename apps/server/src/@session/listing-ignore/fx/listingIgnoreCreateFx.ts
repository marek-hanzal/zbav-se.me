import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { UserContextFx } from "../../../auth/UserContextFx";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { InvalidRequestError } from "../../../error/InvalidRequestError";

export namespace listingIgnoreCreateFx {
	export interface Props {
		listingId: string;
		createdAt?: Date;
	}
}

export const listingIgnoreCreateFx = ({
	listingId,
	createdAt = new Date(),
}: listingIgnoreCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;
		const id = genId();

		return yield* Effect.tryPromise({
			async try() {
				return database
					.insertInto("listing_ignore")
					.values({
						id,
						userId: user.id,
						listingId,
						createdAt,
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			},
			catch() {
				return new InvalidRequestError({
					message: "You have already ignored this listing",
				});
			},
		});
	});
};

export type listingIgnoreCreateFx = ReturnType<typeof listingIgnoreCreateFx>;
