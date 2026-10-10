import type { FC } from "react";
import { SellerInfoButton } from "~/buyer-listing/ui/SellerInfo/SellerInfoButton";
import type { TransactionSchema } from "~/buyer-transaction/schema/TransactionSchema";
import { RejectButton } from "~/buyer-transaction/ui/RejectButton";
import type { Container } from "~/ui/ui/Container";
import { Group } from "~/ui/ui/Group";
import { MessageButtonUi } from "~/user-transaction/ui/MessageButtonUi";
import type { TransactionMenuButton } from "~/user-transaction/ui/TransactionMenuButton";

export namespace InterestMessage {
	export interface Props extends Container.Props {
		closeFn: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const InterestMessage: FC<InterestMessage.Props> = ({ closeFn, transaction, ...props }) => {
	return (
		<>
			<Group
				data-ui-round="default"
				data-ui-flow="vertical"
				data-ui-tone="primary"
				{...props}
			>
				<SellerInfoButton
					listingId={transaction.listingId}
					{...MessageButtonUi}
				/>
			</Group>

			<Group
				data-ui-round="default"
				data-ui-flow="vertical"
				data-ui-tone="primary"
				{...props}
			>
				<RejectButton
					closeFn={closeFn}
					transaction={transaction}
					{...MessageButtonUi}
				/>
			</Group>
		</>
	);
};
