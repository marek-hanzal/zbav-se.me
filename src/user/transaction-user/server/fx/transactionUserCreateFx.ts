import { Effect } from "effect";
import { DateServiceFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import type { TransactionSideEnumSchema } from "~/common/user-transaction/enum/TransactionSideEnumSchema";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

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
