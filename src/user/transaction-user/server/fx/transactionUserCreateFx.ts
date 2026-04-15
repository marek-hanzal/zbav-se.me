import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import type { TransactionSideEnumSchema } from "~/common/user-transaction/enum/TransactionSideEnumSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
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
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;
			const createdAt = dateContext.now().toJSDate();

			yield* tryDbFx(async () =>
				kysely
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
					.execute(),
			);
		}),
	);
});
