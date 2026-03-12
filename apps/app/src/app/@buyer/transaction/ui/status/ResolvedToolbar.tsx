import type { tTransaction } from "@zbav-se.me/sdk/api/buyer";
import type { FC } from "react";
import type { TransactionMenuButton } from "~/app/@common/transaction/ui/TransactionMenuButton";
import { TransactionButtonUi } from "~/app/v0/@common/transaction/ui/TransactionButtonUi";
import { CloseButton } from "../button/CloseButton";
import { DisputeButton } from "../button/DisputeButton";
import { SuccessButton } from "../button/SuccessButton";

export namespace ResolvedToolbar {
	export interface Props {
		close: TransactionMenuButton.Close;
		transaction: tTransaction;
	}
}

export const ResolvedToolbar: FC<ResolvedToolbar.Props> = ({ close, transaction }) => (
	<>
		<SuccessButton
			close={close}
			transaction={transaction}
			{...TransactionButtonUi}
		/>
		<CloseButton
			close={close}
			transaction={transaction}
			{...TransactionButtonUi}
		/>
		<DisputeButton
			close={close}
			transaction={transaction}
			{...TransactionButtonUi}
		/>
	</>
);
