import type { tTransaction } from "@zbav-se.me/sdk/api/seller";
import type { FC } from "react";
import { TransactionButtonUi } from "~/app/v0/@common/transaction/ui/TransactionButtonUi";
import { ResolveButton } from "~/app/v0/@seller-user/transaction/ui/button/ResolveButton";

export namespace DisputeToolbar {
	export interface Props {
		transaction: tTransaction;
	}
}

export const DisputeToolbar: FC<DisputeToolbar.Props> = ({ transaction }) => {
	return (
		<ResolveButton
			transaction={transaction}
			{...TransactionButtonUi}
		/>
	);
};
