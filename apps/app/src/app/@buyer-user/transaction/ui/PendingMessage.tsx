import { Container } from "@use-pico/client/ui/container";
import type { tTransaction } from "@zbav-se.me/sdk/api/buyer-user";
import type { FC } from "react";
import { SellerInfoButton } from "~/app/@buyer-session/listing/ui/SellerInfoButton";
import { RejectButton } from "./button/RejectButton";
import { MessageButtonUi } from "~/app/@common/transaction/ui/MessageButtonUi";

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
