import type { FC } from "react";
import type { TransactionSchema } from "~/seller/transaction/server/schema/TransactionSchema";
import { BuyerInfoButton } from "~/seller/transaction/ui/button/BuyerInfoButton";
import type { Container } from "~/ui/ui/Container";
import { Group } from "~/ui/ui/Group";
import { MessageButtonUi } from "~/user/transaction/ui/MessageButtonUi";
import type { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";
import { GalleryButton } from "~/user/transaction-entry/ui/button/GalleryButton";
import { LocationButton } from "~/user/transaction-entry/ui/button/LocationButton";
import { PackageButton } from "~/user/transaction-entry/ui/button/PackageButton";
import { PersonalButton } from "~/user/transaction-entry/ui/button/PersonalButton";

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
				data-ui={"TradeMessage"}
				data-ui-round="default"
				data-ui-flow="vertical"
				data-ui-tone="neutral"
				{...props}
			>
				<PackageButton
					close={close}
					transactionId={transaction.id}
					{...MessageButtonUi}
				/>

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
				data-ui={"TradeMessage"}
				data-ui-round="default"
				data-ui-flow="vertical"
				data-ui-tone="neutral"
				{...props}
			>
				<BuyerInfoButton
					transactionId={transaction.id}
					{...MessageButtonUi}
				/>
			</Group>
		</>
	);
};
