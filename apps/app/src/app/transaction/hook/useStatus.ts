import type { tTransaction } from "@zbav-se.me/sdk/api/user";

export namespace useStatus {
	export interface Props {
		transaction: tTransaction;
	}
}

export const useStatus = ({ transaction }: useStatus.Props) => {
	const status = transaction.status[transaction.status.length - 1];
	if (!status) {
		throw new Error("Invalid transaction state - empty status");
	}

	return status;
};
