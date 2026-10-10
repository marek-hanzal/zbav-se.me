import type { FC } from "react";
import type { TransactionSchema } from "~/seller-transaction/schema/TransactionSchema";
import { RejectButton } from "~/seller-transaction/ui/RejectButton";
import { ResolveButton } from "~/seller-transaction/ui/ResolveButton";
import { Group } from "~/ui/ui/Group";
import { TransactionButtonUi } from "~/user-transaction/ui/TransactionButtonUi";
import type { TransactionMenuButton } from "~/user-transaction/ui/TransactionMenuButton";

export namespace TradeToolbar {
	export interface Props {
		closeFn: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const TradeToolbar: FC<TradeToolbar.Props> = ({ closeFn, transaction }) => {
	return (
		<Group>
			<ResolveButton
				closeFn={closeFn}
				transaction={transaction}
				{...TransactionButtonUi}
			/>

			<RejectButton
				closeFn={closeFn}
				transaction={transaction}
				{...TransactionButtonUi}
			/>
		</Group>
	);
};
