import { Effect } from "effect";
import { flagFetchFx } from "~/@buyer-user/flag/fx/flagFetchFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { withTraceFx } from "~/effect/withTraceFx";

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
	yield* withTraceFx({
		fx: "flagDeleteFx",
		input: {
			userId,
			listingId,
		},
	});

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

			yield* tryDbFx(async () =>
				kysely.deleteFrom("flag").where("id", "=", flag.id).execute(),
			);

			return flag;
		}),
	);
});

export type flagDeleteFx = ReturnType<typeof flagDeleteFx>;
