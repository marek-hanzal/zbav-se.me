import type { TransactionContext } from "~/@common/transaction/context/TransactionContextFx";

export const DefaultTransactionContext: TransactionContext = {
	expires: 3,
	extend: 3,
};
