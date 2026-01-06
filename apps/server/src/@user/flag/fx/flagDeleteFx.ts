import { Effect } from "effect";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { flagFetchFx } from "./flagFetchFx";

export namespace flagDeleteFx {
	export interface Props {
		listingId: string;
	}
}

export const flagDeleteFx = Effect.fn("flagDeleteFx")(function* ({
	listingId,
}: flagDeleteFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;
			const user = yield* UserContextFx;

			const flag = yield* flagFetchFx({
				where: {
					listingId,
					userId: user.id,
				},
			});

			yield* Effect.promise(async () => {
				return database
					.deleteFrom("flag")
					.where("userId", "=", user.id)
					.where("listingId", "=", listingId)
					.execute();
			});

			return flag;
		}),
	);
});

export type flagDeleteFx = ReturnType<typeof flagDeleteFx>;
