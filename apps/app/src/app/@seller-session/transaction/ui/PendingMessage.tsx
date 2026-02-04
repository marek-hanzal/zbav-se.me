import { Container } from "@use-pico/client/ui/container";
import type { tTransaction } from "@zbav-se.me/sdk/api/seller-user";
import type { FC } from "react";
import { MessageButtonUi } from "~/app/@common/transaction/ui/MessageButtonUi";
import { BuyerInfoButton } from "~/app/@seller-session/transaction/ui/BuyerInfoButton";
import { AcceptButton } from "~/app/@seller-user/transaction/ui/button/AcceptButton";
import { RejectButton } from "~/app/@seller-user/transaction/ui/button/RejectButton";

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
