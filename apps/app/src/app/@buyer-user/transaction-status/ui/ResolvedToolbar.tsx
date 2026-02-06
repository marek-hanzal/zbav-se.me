import type { tTransaction } from "@zbav-se.me/sdk/api/buyer-user";
import type { FC } from "react";
import { CloseButton } from "~/app/@buyer-user/transaction/ui/button/CloseButton";
import { DisputeButton } from "~/app/@buyer-user/transaction/ui/button/DisputeButton";
import { SuccessButton } from "~/app/@buyer-user/transaction/ui/button/SuccessButton";
import { TransactionButtonUi } from "~/app/@common/transaction/ui/TransactionButtonUi";

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
