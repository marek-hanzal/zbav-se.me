import { Effect } from "effect";
import { UserContextFx } from "../../../auth/UserContextFx";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { NotFoundError } from "../../../error/NotFoundError";
import { listingIgnoreFetchFx } from "./listingIgnoreFetchFx";

export namespace listingIgnoreDeleteFx {
	export interface Props {
		listingId: string;
	}
}

export const listingIgnoreDeleteFx = ({ listingId }: listingIgnoreDeleteFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const ignore = yield* listingIgnoreFetchFx({
			query: {
				where: {
					listingId,
					userId: user.id,
				},
			},
		});

		if (!ignore) {
			return yield* new NotFoundError({
				resource: "listing-ignore",
				resourceId: listingId,
				message: "Listing ignore not found",
			});
		}

		yield* Effect.tryPromise(async () => {
			return database
				.deleteFrom("listing_ignore")
				.where("userId", "=", user.id)
				.where("listingId", "=", listingId)
				.execute();
		});

		return ignore;
	});
};

export type listingIgnoreDeleteFx = ReturnType<typeof listingIgnoreDeleteFx>;
