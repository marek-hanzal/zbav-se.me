import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { favouriteFetchFx } from "~/buyer/favourite/server/fx/favouriteFetchFx";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export namespace favouriteDeleteFx {
	export interface Props {
		userId: string;
		listingId: string;
	}
}

export const favouriteDeleteFx = Effect.fn("favouriteDeleteFx")(function* ({
	userId,
	listingId,
}: favouriteDeleteFx.Props) {
	const logger = yield* getLoggerFx("favouriteDeleteFx", "favourite");
	logger.trace("Request", {
		userId,
		listingId,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;

			const favourite = yield* favouriteFetchFx({
				where: {
					listingId,
				},
				scope: {
					userId,
				},
			});

			yield* tryDbFx(async () =>
				kysely.deleteFrom("favourite").where("id", "=", favourite.id).execute(),
			);

			return favourite;
		}),
	);
});

export type favouriteDeleteFx = ReturnType<typeof favouriteDeleteFx>;
