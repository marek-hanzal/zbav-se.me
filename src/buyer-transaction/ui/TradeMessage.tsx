import type { FC } from "react";
import { SellerInfoButton } from "~/buyer-listing/ui/SellerInfo/SellerInfoButton";
import type { TransactionSchema } from "~/buyer-transaction/schema/TransactionSchema";
import type { Container } from "~/ui/ui/Container";
import { Group } from "~/ui/ui/Group";
import { MessageButtonUi } from "~/user-transaction/ui/MessageButtonUi";
import type { TransactionMenuButton } from "~/user-transaction/ui/TransactionMenuButton";
import { GalleryButton } from "~/user-transaction-entry/ui/GalleryButton.exports";
import { LocationButton } from "~/user-transaction-entry/ui/LocationButton/index";
import { PersonalButton } from "~/user-transaction-entry/ui/PersonalButton/index";

export namespace TradeMessage {
	export interface Props extends Container.Props {
		close: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const TradeMessage: FC<TradeMessage.Props> = ({ close, transaction, ...props }) => {
	return (
		<>
			<Group
				data-ui-round="default"
				data-ui-flow="vertical"
				data-ui-tone="primary"
				{...props}
			>
				<PersonalButton
					close={close}
					transactionId={transaction.id}
					{...MessageButtonUi}
				/>

				<LocationButton
					close={close}
					transactionId={transaction.id}
					{...MessageButtonUi}
				/>

				<GalleryButton
					close={close}
					transactionId={transaction.id}
					{...MessageButtonUi}
				/>
			</Group>

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
		</>
	);
};
