import type { FC } from "react";
import { Group } from "@/lib/client/group";
import type { TransactionSchema } from "~/seller/transaction/server/schema/TransactionSchema";
import { RejectButton } from "~/seller/transaction/ui/button/RejectButton";
import { TransactionButtonUi } from "~/user/transaction/ui/TransactionButtonUi";
import type { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";
import { ResolveButton } from "../button/ResolveButton";

export namespace TradeToolbar {
	export interface Props {
		close: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const TradeToolbar: FC<TradeToolbar.Props> = ({ close, transaction }) => {
	return (
		<Group>
			<ResolveButton
				close={close}
				transaction={transaction}
				{...TransactionButtonUi}
			/>

			<RejectButton
				close={close}
				transaction={transaction}
				{...TransactionButtonUi}
			/>
		</Group>
	);
};
