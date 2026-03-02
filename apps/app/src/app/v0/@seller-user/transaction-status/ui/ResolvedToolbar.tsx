import type { tTransaction } from "@zbav-se.me/sdk/api/seller";
import type { FC } from "react";
import { TransactionButtonUi } from "~/app/v0/@common/transaction/ui/TransactionButtonUi";
import { DisputeButton } from "~/app/v0/@seller-user/transaction/ui/button/DisputeButton";

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
