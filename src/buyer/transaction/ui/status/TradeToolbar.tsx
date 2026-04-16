import type { FC } from "react";
import { Group } from "@/lib/client/group";
import type { TransactionSchema } from "~/buyer/transaction/server/schema/TransactionSchema";
import { RejectButton } from "~/buyer/transaction/ui/button/RejectButton";
import { TransactionButtonUi } from "~/user/transaction/ui/TransactionButtonUi";
import type { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";

export namespace TradeToolbar {
	export interface Props {
		close: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const TradeToolbar: FC<TradeToolbar.Props> = ({ close, transaction }) => {
	return (
		<Group>
			<RejectButton
				close={close}
				transaction={transaction}
				{...TransactionButtonUi}
			/>
		</Group>
	);
};
