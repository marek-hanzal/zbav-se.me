import type { tTransaction } from "@zbav-se.me/sdk/api/seller";
import type { FC } from "react";
import type { TransactionMenuButton } from "~/app/@common/transaction/ui/TransactionMenuButton";
import { TransactionButtonUi } from "~/app/v0/@common/transaction/ui/TransactionButtonUi";
import { DisputeButton } from "../button/DisputeButton";

export namespace ResolvedToolbar {
	export interface Props {
		close: TransactionMenuButton.Close;
		transaction: tTransaction;
	}
}

export const ResolvedToolbar: FC<ResolvedToolbar.Props> = ({ close, transaction }) => (
	<DisputeButton
		close={close}
		transaction={transaction}
		{...TransactionButtonUi}
	/>
);
