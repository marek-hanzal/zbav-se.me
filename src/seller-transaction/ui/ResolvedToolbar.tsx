import type { FC } from "react";
import type { TransactionSchema } from "~/seller-transaction/schema/TransactionSchema";
import { DisputeButton } from "~/seller-transaction/ui/DisputeButton";
import { Group } from "~/ui/ui/Group";
import { TransactionButtonUi } from "~/user-transaction/ui/TransactionButtonUi";
import type { TransactionMenuButton } from "~/user-transaction/ui/TransactionMenuButton";

export namespace ResolvedToolbar {
	export interface Props {
		closeFn: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const ResolvedToolbar: FC<ResolvedToolbar.Props> = ({ closeFn, transaction }) => (
	<Group>
		<DisputeButton
			closeFn={closeFn}
			transaction={transaction}
			{...TransactionButtonUi}
		/>
	</Group>
);
