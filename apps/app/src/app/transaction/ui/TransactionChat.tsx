import { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import { ChatInput } from "@zbav-se.me/ui/chat";
import type { FC } from "react";
import { TransactionToolbar } from "~/app/transaction/ui/TransactionToolbar";

export namespace TransactionChat {
	export interface Props extends Container.Props {
		transactionId: string;
	}
}

export const TransactionChat: FC<TransactionChat.Props> = ({ transactionId, ui, ...props }) => {
	return (
		<Container
			ui={{
				layout: "vertical-flex",
				width: "full",
				...ui,
			}}
			{...props}
		>
			<TransactionToolbar transactionId={transactionId} />
			<ChatInput
				onSubmit={() => {
					//
				}}
				placeholder={translator.text("Transaction - send a message (placeholder)")}
				loading={false}
			/>
		</Container>
	);
};
