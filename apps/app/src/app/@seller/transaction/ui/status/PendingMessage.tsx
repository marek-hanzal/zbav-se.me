import type { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import type { tTransaction } from "@zbav-se.me/sdk/api/seller";
import type { FC } from "react";
import type { TransactionMenuButton } from "~/app/@common/transaction/ui/TransactionMenuButton";
import { BuyerInfoButton } from "~/app/@seller/transaction/~public/BuyerInfoButton";
import { MessageButtonUi } from "~/app/v0/@common/transaction/ui/MessageButtonUi";
import { AcceptButton } from "../button/AcceptButton";
import { RejectButton } from "../button/RejectButton";

export namespace PendingMessage {
	export interface Props extends Container.Props {
		close: TransactionMenuButton.Close;
		transaction: tTransaction;
	}
}

export const PendingMessage: FC<PendingMessage.Props> = ({ close, transaction, ui, ...props }) => {
	return (
		<Group
			ui={{
				round: "default",
				flow: "vertical",
				tone: "link",
				...ui,
			}}
			{...props}
		>
			<BuyerInfoButton
				transactionId={transaction.id}
				{...MessageButtonUi}
			/>

			<AcceptButton
				close={close}
				transaction={transaction}
				{...MessageButtonUi}
			/>

			<RejectButton
				close={close}
				transaction={transaction}
				{...MessageButtonUi}
			/>
		</Group>
	);
};
