import type { FC } from "react";
import type { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { SellerInfoButton } from "~/buyer/listing/SellerInfo/SellerInfoButton";
import type { TransactionSchema } from "~/buyer/transaction/server/schema/TransactionSchema";
import { MessageButtonUi } from "~/user/transaction/ui/MessageButtonUi";
import type { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";
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
					close={close}
					transaction={transaction}
					{...MessageButtonUi}
				/>
			</Group>
		</>
	);
};
