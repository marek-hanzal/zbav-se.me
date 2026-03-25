import type { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import type { tTransaction } from "@zbav-se.me/sdk/api/buyer";
import type { FC } from "react";
import { SellerInfoButton } from "~/client/@buyer/listing/~public/SellerInfoButton";
import { MessageButtonUi } from "~/client/@common/transaction/ui/MessageButtonUi";
import type { TransactionMenuButton } from "~/client/@common/transaction/ui/TransactionMenuButton";
import { RejectButton } from "../button/RejectButton";

export namespace PendingMessage {
	export interface Props extends Container.Props {
		close: TransactionMenuButton.Close;
		transaction: tTransaction;
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
