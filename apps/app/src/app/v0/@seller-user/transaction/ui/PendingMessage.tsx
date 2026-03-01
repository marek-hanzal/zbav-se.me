import { Container } from "@use-pico/client/ui/container";
import type { tTransaction } from "@zbav-se.me/sdk/api/seller-user";
import type { FC } from "react";
import { BuyerInfoButton } from "~/app/@seller-session/transaction/ui/BuyerInfoButton";
import { MessageButtonUi } from "~/app/v0/@common/transaction/ui/MessageButtonUi";
import { AcceptButton } from "./button/AcceptButton";
import { RejectButton } from "./button/RejectButton";

export namespace PendingMessage {
	export interface Props extends Container.Props {
		transaction: tTransaction;
	}
}

export const PendingMessage: FC<PendingMessage.Props> = ({ transaction, ui, ...props }) => {
	return (
		<Container
			ui={{
				round: "default",
				flow: "vertical",
				gap: "default",
				tone: "link",
				...ui,
			}}
			className={[
				"w-2/3",
				"ml-auto",
			]}
			{...props}
		>
			<BuyerInfoButton
				transactionId={transaction.id}
				{...MessageButtonUi}
			/>

			<AcceptButton
				transaction={transaction}
				{...MessageButtonUi}
			/>

			<RejectButton
				transaction={transaction}
				{...MessageButtonUi}
			/>
		</Container>
	);
};
