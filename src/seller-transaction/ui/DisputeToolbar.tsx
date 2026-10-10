import type { FC } from "react";
import type { TransactionSchema } from "~/seller-transaction/schema/TransactionSchema";
import { ResolveButton } from "~/seller-transaction/ui/ResolveButton";
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
			<ResolveButton
				closeFn={closeFn}
				transaction={transaction}
				{...TransactionButtonUi}
			/>
		</Group>
	);
};
