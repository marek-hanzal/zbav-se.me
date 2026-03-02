import { Container } from "@use-pico/client/ui/container";
import type { tTransaction } from "@zbav-se.me/sdk/api/buyer";
import type { FC } from "react";
import { SellerInfoButton } from "~/app/@buyer/listing/~public/SellerInfoButton";
import { MessageButtonUi } from "~/app/v0/@common/transaction/ui/MessageButtonUi";
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
				tone: "primary",
				...ui,
			}}
			className={[
				"w-2/3",
				"ml-auto",
			]}
			{...props}
		>
			<SellerInfoButton
				listingId={transaction.listingId}
				{...MessageButtonUi}
			/>

			<RejectButton
				transaction={transaction}
				{...MessageButtonUi}
			/>
		</Container>
	);
};
