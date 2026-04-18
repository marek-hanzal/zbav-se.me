import type { FC } from "react";
import type { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import type { TransactionSchema } from "~/seller/transaction/server/schema/TransactionSchema";
import { BuyerInfoButton } from "~/seller/transaction/ui/button/BuyerInfoButton";
import { MessageButtonUi } from "~/user/transaction/ui/MessageButtonUi";
import type { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";
import { AcceptButton } from "../button/AcceptButton";
import { RejectButton } from "../button/RejectButton";

export namespace InterestMessage {
	export interface Props extends Container.Props {
		close: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const InterestMessage: FC<InterestMessage.Props> = ({ close, transaction, ...props }) => {
	return (
		<>
			<Group
				data-ui={"InterestMessage[Group].Info"}
				data-ui-round="default"
				data-ui-flow="vertical"
				data-ui-tone="link"
				{...props}
			>
				<BuyerInfoButton
					transactionId={transaction.id}
					{...MessageButtonUi}
				/>
			</Group>

			<Group
				data-ui={"InterestMessage[Group].Buttons"}
				data-ui-round="default"
				data-ui-flow="vertical"
				data-ui-tone="link"
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
