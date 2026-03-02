import type { tTransaction } from "@zbav-se.me/sdk/api/buyer";
import type { FC } from "react";
import { CloseButton } from "~/app/v0/@buyer-user/transaction/ui/button/CloseButton";
import { DisputeButton } from "~/app/v0/@buyer-user/transaction/ui/button/DisputeButton";
import { SuccessButton } from "~/app/v0/@buyer-user/transaction/ui/button/SuccessButton";
import { TransactionButtonUi } from "~/app/v0/@common/transaction/ui/TransactionButtonUi";

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
