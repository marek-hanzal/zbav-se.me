import type { tTransaction } from "@zbav-se.me/sdk/api/buyer";
import type { FC } from "react";
import { TransactionButtonUi } from "~/app/@common/transaction/ui";
import type { TransactionMenuButton } from "~/app/@common/transaction/ui/TransactionMenuButton";
import { CloseButton } from "../button/CloseButton";
import { SuccessButton } from "../button/SuccessButton";

export namespace DisputeToolbar {
	export interface Props {
		close: TransactionMenuButton.Close;
		transaction: tTransaction;
	}
}

export const DisputeToolbar: FC<DisputeToolbar.Props> = ({ close, transaction }) => {
	return (
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
		</>
	);
};
