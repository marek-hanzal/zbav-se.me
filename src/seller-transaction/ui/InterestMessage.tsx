import type { FC } from "react";
import type { TransactionSchema } from "~/seller-transaction/schema/TransactionSchema";
import { AcceptButton } from "~/seller-transaction/ui/AcceptButton";
import { BuyerInfoButton } from "~/seller-transaction/ui/BuyerInfoButton";
import { RejectButton } from "~/seller-transaction/ui/RejectButton";
import type { Container } from "~/ui/ui/Container";
import { Group } from "~/ui/ui/Group";
import { MessageButtonUi } from "~/user-transaction/ui/MessageButtonUi";
import type { TransactionMenuButton } from "~/user-transaction/ui/TransactionMenuButton";

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
