import type { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import type { FC } from "react";
import { BuyerInfoButton } from "~/seller/transaction/~public/BuyerInfoButton";
import type { TransactionSchema } from "~/seller/transaction/server/schema/TransactionSchema";
import { MessageButtonUi } from "~/user/transaction/ui/MessageButtonUi";
import type { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";
import { AcceptButton } from "../button/AcceptButton";
import { RejectButton } from "../button/RejectButton";

export namespace PendingMessage {
	export interface Props extends Container.Props {
		close: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const PendingMessage: FC<PendingMessage.Props> = ({ close, transaction, ui, ...props }) => {
	return (
		<>
			<Group
				data-ui={"PendingMessage[Group].Info"}
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
			</Group>

			<Group
				data-ui={"PendingMessage[Group].Buttons"}
				ui={{
					round: "default",
					flow: "vertical",
					tone: "link",
					...ui,
				}}
				{...props}
			>
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
		</>
	);
};
