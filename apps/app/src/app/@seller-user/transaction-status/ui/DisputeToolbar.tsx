import type { tTransaction } from "@zbav-se.me/sdk/api/seller-user";
import type { FC } from "react";
import { TransactionButtonUi } from "~/app/@common/transaction/ui/TransactionButtonUi";
import { ResolveButton } from "~/app/@seller-user/transaction/ui/button/ResolveButton";

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
