import type { tTransaction } from "@zbav-se.me/sdk/api/buyer-user";
import type { FC } from "react";
import { CloseButton } from "~/app/@buyer-user/transaction/ui/button/CloseButton";
import { SuccessButton } from "~/app/@buyer-user/transaction/ui/button/SuccessButton";
import { TransactionButtonUi } from "~/app/transaction/ui/transaction-status/TransactionButtonUi";

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
