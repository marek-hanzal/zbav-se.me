import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { flagFetchFx } from "~/app/flag/fx/flagFetchFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace flagDeleteFx {
	export interface Props {
		userId: string;
		listingId: string;
	}
}

export const flagDeleteFx = Effect.fn("flagDeleteFx")(function* ({
	userId,
	listingId,
}: flagDeleteFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;

			const flag = yield* flagFetchFx({
				where: {
					listingId,
				},
				scope: {
					userId,
				},
			});

			yield* Effect.promise(async () => {
				return database.deleteFrom("flag").where("id", "=", flag.id).execute();
			});

			return flag;
		}),
	);
});

export type flagDeleteFx = ReturnType<typeof flagDeleteFx>;

