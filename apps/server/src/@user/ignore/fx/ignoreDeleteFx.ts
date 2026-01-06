import { Effect } from "effect";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { ignoreFetchFx } from "./ignoreFetchFx";

export namespace ignoreDeleteFx {
	export interface Props {
		listingId: string;
	}
}

export const ignoreDeleteFx = Effect.fn("ignoreDeleteFx")(function* ({
	listingId,
}: ignoreDeleteFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;
			const user = yield* UserContextFx;

			const ignore = yield* ignoreFetchFx({
				where: {
					listingId,
					userId: user.id,
				},
			});

			yield* Effect.promise(async () => {
				return database
					.deleteFrom("ignore")
					.where("userId", "=", user.id)
					.where("listingId", "=", listingId)
					.execute();
			});

			return ignore;
		}),
	);
});

export type ignoreDeleteFx = ReturnType<typeof ignoreDeleteFx>;
