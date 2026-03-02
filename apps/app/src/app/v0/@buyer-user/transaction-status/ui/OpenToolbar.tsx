import type { tTransaction } from "@zbav-se.me/sdk/api/buyer";
import type { FC } from "react";
import { CloseButton } from "~/app/v0/@buyer-user/transaction/ui/button/CloseButton";
import { SuccessButton } from "~/app/v0/@buyer-user/transaction/ui/button/SuccessButton";
import { TransactionButtonUi } from "~/app/v0/@common/transaction/ui/TransactionButtonUi";

export namespace OpenToolbar {
	export interface Props {
		transaction: tTransaction;
	}
}

export const OpenToolbar: FC<OpenToolbar.Props> = ({ transaction }) => {
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
