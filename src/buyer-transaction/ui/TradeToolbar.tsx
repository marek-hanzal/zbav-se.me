import type { FC } from "react";
import type { TransactionSchema } from "~/buyer-transaction/schema/TransactionSchema";
import { RejectButton } from "~/buyer-transaction/ui/RejectButton";
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
			<RejectButton
				closeFn={closeFn}
				transaction={transaction}
				{...TransactionButtonUi}
			/>
		</Group>
	);
};
