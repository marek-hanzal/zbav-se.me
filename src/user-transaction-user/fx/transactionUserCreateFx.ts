import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { genId } from "~/identity/fn/genId";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import type { TransactionSideEnumSchema } from "~/transaction-contract/schema/TransactionSideEnumSchema";

export namespace transactionUserCreateFx {
	export interface User {
		userId: string;
		side: Extract<TransactionSideEnumSchema.Type, "buyer" | "seller">;
	}

	export interface Props {
		transactionId: string;
		users: User[];
	}
}

export const transactionUserCreateFx = Effect.fn("transactionUserCreateFx")(function* ({
	transactionId,
	users,
}: transactionUserCreateFx.Props) {
	const logger = yield* getLoggerFx("transactionUserCreateFx");
	logger.trace("transactionUserCreateFx", {
		transactionId,
		users,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const dateService = yield* DateServiceFx;
			const createdAt = dateService.now().toJSDate();

			yield* dbFx(async (kysely) => {
				return kysely
					.insertInto("transaction_user")
					.values(
						users.map(({ userId, side }) => ({
							id: genId(),
							transactionId,
							userId,
							side,
							createdAt,
						})),
					)
					.execute();
			});
		}),
	);
});
