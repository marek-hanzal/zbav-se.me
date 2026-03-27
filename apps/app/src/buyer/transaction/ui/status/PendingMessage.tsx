import type { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import type { FC } from "react";
import { SellerInfoButton } from "~/buyer/listing/~public/SellerInfoButton";
import type { TransactionSchema } from "~/buyer/transaction/server/schema/TransactionSchema";
import { MessageButtonUi } from "~/user/transaction/ui/MessageButtonUi";
import type { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";
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
			</Group>

			<Group
				ui={{
					round: "default",
					flow: "vertical",
					tone: "primary",
					...ui,
				}}
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
