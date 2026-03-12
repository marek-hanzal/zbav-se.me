import type { tTransaction } from "@zbav-se.me/sdk/api/seller";
import type { FC } from "react";
import { TransactionButtonUi } from "~/app/@common/transaction/ui";
import type { TransactionMenuButton } from "~/app/@common/transaction/ui/TransactionMenuButton";
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
