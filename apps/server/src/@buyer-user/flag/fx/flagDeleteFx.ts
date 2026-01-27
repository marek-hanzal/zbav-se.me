import { Effect } from "effect";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { flagFetchFx } from "./flagFetchFx";

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
			const { kysely } = yield* KyselyContextFx;

			const flag = yield* flagFetchFx({
				where: {
					listingId,
				},
				scope: {
					userId,
				},
			});

			yield* Effect.promise(async () => {
				return kysely.deleteFrom("flag").where("id", "=", flag.id).execute();
			});

			return flag;
		}),
	);
});

export type flagDeleteFx = ReturnType<typeof flagDeleteFx>;
