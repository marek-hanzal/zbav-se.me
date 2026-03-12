import type { tTransaction } from "@zbav-se.me/sdk/api/buyer";
import type { FC } from "react";
import { TransactionButtonUi } from "~/app/v0/@common/transaction/ui/TransactionButtonUi";
import { CloseButton } from "../button/CloseButton";
import { DisputeButton } from "../button/DisputeButton";
import { SuccessButton } from "../button/SuccessButton";

export namespace ResolvedToolbar {
	export interface Props {
		transaction: tTransaction;
	}
}

export const ResolvedToolbar: FC<ResolvedToolbar.Props> = ({ transaction }) => (
	<>
		<SuccessButton
			transaction={transaction}
			{...TransactionButtonUi}
		/>
		<CloseButton
			transaction={transaction}
			{...TransactionButtonUi}
		/>
		<DisputeButton
			transaction={transaction}
			{...TransactionButtonUi}
		/>
	</>
);
