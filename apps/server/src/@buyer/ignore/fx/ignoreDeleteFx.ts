import { Effect } from "effect";
import { ignoreFetchFx } from "~/@buyer/ignore/fx/ignoreFetchFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace ignoreDeleteFx {
	export interface Props {
		userId: string;
		listingId: string;
	}
}

export const ignoreDeleteFx = Effect.fn("ignoreDeleteFx")(function* ({
	userId,
	listingId,
}: ignoreDeleteFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;

			const ignore = yield* ignoreFetchFx({
				where: {
					listingId,
				},
				scope: {
					userId,
				},
			});

			yield* tryDbFx(async () =>
				kysely.deleteFrom("ignore").where("id", "=", ignore.id).execute(),
			);

			return ignore;
		}),
	);
});

export type ignoreDeleteFx = ReturnType<typeof ignoreDeleteFx>;
