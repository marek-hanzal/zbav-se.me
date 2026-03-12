import type { tTransaction } from "@zbav-se.me/sdk/api/seller";
import type { FC } from "react";
import type { TransactionMenuButton } from "~/app/@common/transaction/ui/TransactionMenuButton";
import { TransactionButtonUi } from "~/app/v0/@common/transaction/ui/TransactionButtonUi";
import { ResolveButton } from "../button/ResolveButton";

export namespace DisputeToolbar {
	export interface Props {
		close: TransactionMenuButton.Close;
		transaction: tTransaction;
	}
}

export const DisputeToolbar: FC<DisputeToolbar.Props> = ({ close, transaction }) => {
	return (
		<ResolveButton
			close={close}
			transaction={transaction}
			{...TransactionButtonUi}
		/>
	);
};
