import type { tTransaction } from "@zbav-se.me/sdk/api/buyer";
import type { FC } from "react";
import { TransactionButtonUi } from "~/app/v0/@common/transaction/ui/TransactionButtonUi";
import { CloseButton } from "../button/CloseButton";
import { SuccessButton } from "../button/SuccessButton";

export namespace DisputeToolbar {
	export interface Props {
		transaction: tTransaction;
	}
}

export const DisputeToolbar: FC<DisputeToolbar.Props> = ({ transaction }) => {
	return (
		<>
			<SuccessButton
				transaction={transaction}
				{...TransactionButtonUi}
			/>
			<CloseButton
				transaction={transaction}
				{...TransactionButtonUi}
			/>
		</>
	);
};
