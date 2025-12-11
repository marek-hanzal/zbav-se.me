import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";
import { withTransactionGalleryQueryBuilder } from "../db/withTransactionGalleryQueryBuilder";
import { withTransactionGallerySelect } from "../db/withTransactionGallerySelect";
import type { TransactionGalleryQuerySchema } from "../schema/TransactionGalleryQuerySchema";
import { TransactionGallerySchema } from "../schema/TransactionGallerySchema";

export namespace transactionGalleryFetchFx {
	export interface Props {
		query: Omit<TransactionGalleryQuerySchema.Type, "cursor">;
	}
}

export const transactionGalleryFetchFx = ({
	query,
}: transactionGalleryFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withTransactionGallerySelect({
					database,
					sort,
				}),
				output: TransactionGallerySchema,
				filter,
				where,
				query: withTransactionGalleryQueryBuilder,
			});
		});

		if (!data) {
			return yield* new NotFoundError({
				resource: "transaction-gallery",
				resourceId: "(query)",
				message: "Listing transaction gallery not found",
			});
		}

		return data;
	});
};

export type transactionGalleryFetchFx = ReturnType<typeof transactionGalleryFetchFx>;
