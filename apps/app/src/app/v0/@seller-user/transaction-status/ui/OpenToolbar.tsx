import type { tTransaction } from "@zbav-se.me/sdk/api/seller";
import type { FC } from "react";
import { TransactionButtonUi } from "~/app/v0/@common/transaction/ui/TransactionButtonUi";
import { ResolveButton } from "~/app/v0/@seller-user/transaction/ui/button/ResolveButton";

export namespace OpenToolbar {
	export interface Props {
		transaction: tTransaction;
	}
}

export const OpenToolbar: FC<OpenToolbar.Props> = ({ transaction }) => {
	return (
		<ResolveButton
			transaction={transaction}
			{...TransactionButtonUi}
		/>
	);
};
