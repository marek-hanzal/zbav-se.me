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

export const flagDeleteFx = ({ listingId }: flagDeleteFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;
			const user = yield* UserContextFx;

			const flag = yield* flagFetchFx({
				query: {
					where: {
						listingId,
						userId: user.id,
					},
				},
			});

			yield* Effect.tryPromise(async () => {
				return database
					.deleteFrom("flag")
					.where("userId", "=", user.id)
					.where("listingId", "=", listingId)
					.execute();
			});

			return flag;
		}),
	);
};

export type flagDeleteFx = ReturnType<typeof flagDeleteFx>;
