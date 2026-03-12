import type { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import type { tTransaction } from "@zbav-se.me/sdk/api/buyer";
import type { FC } from "react";
import { SellerInfoButton } from "~/app/@buyer/listing/~public/SellerInfoButton";
import type { TransactionMenuButton } from "~/app/@common/transaction/ui/TransactionMenuButton";
import { MessageButtonUi } from "~/app/v0/@common/transaction/ui/MessageButtonUi";
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
				tone: "primary",
				...ui,
			}}
			{...props}
		>
			<SellerInfoButton
				listingId={transaction.listingId}
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
