import type { tTransaction } from "@zbav-se.me/sdk/api/seller-user";
import type { FC } from "react";
import { DisputeButton } from "~/app/@seller-user/transaction/ui/button/DisputeButton";
import { TransactionButtonUi } from "~/app/transaction/ui/transaction-status/TransactionButtonUi";

export namespace ResolvedToolbar {
	export interface Props {
		transaction: tTransaction;
	}
}

export const ResolvedToolbar: FC<ResolvedToolbar.Props> = ({ transaction }) => (
	<DisputeButton
		transaction={transaction}
		{...TransactionButtonUi}
	/>
);
