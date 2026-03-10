import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { TransactionSideEnumSchema } from "~/database/@enum/TransactionSideEnumSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

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
