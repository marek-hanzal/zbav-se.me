import type { FC } from "react";
import type { TransactionSchema } from "~/buyer-transaction/schema/TransactionSchema";
import { CloseButton } from "~/buyer-transaction/ui/CloseButton";
import { SuccessButton } from "~/buyer-transaction/ui/SuccessButton";
import { Group } from "~/ui/ui/Group";
import { TransactionButtonUi } from "~/user-transaction/ui/TransactionButtonUi";
import type { TransactionMenuButton } from "~/user-transaction/ui/TransactionMenuButton";

export namespace DisputeToolbar {
	export interface Props {
		closeFn: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const DisputeToolbar: FC<DisputeToolbar.Props> = ({ closeFn, transaction }) => {
	return (
		<Group>
			<SuccessButton
				closeFn={closeFn}
				transaction={transaction}
				{...TransactionButtonUi}
			/>

			<CloseButton
				closeFn={closeFn}
				transaction={transaction}
				{...TransactionButtonUi}
			/>
		</Group>
	);
};
