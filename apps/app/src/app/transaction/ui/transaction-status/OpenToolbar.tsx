import type { tTransaction } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { RejectButton } from "~/app/transaction/ui/button/RejectButton";
import { ResolveButton } from "~/app/transaction/ui/button/ResolveButton";
import { TransactionButtonUi } from "~/app/transaction/ui/transaction-status/TransactionButtonUi";

export namespace OpenToolbar {
	export interface Props {
		transaction: tTransaction;
	}
}

export const OpenToolbar: FC<OpenToolbar.Props> = ({ transaction }) => {
	return (
		<>
			<ResolveButton
				transaction={transaction}
				{...TransactionButtonUi}
			/>

			<RejectButton
				transaction={transaction}
				{...TransactionButtonUi}
			/>
		</>
	);
};
