import { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tUserSideEnum } from "@zbav-se.me/sdk/api/user";
import { ChatInput } from "@zbav-se.me/ui/chat";
import type { FC } from "react";
import { TransactionToolbar } from "~/app/transaction/ui/TransactionToolbar";

export namespace TransactionChat {
	export interface Props extends Container.Props {
		transactionId: string;
		side: tUserSideEnum;
	}
}

export const TransactionChat: FC<TransactionChat.Props> = ({
	transactionId,
	side,
	ui,
	...props
}) => {
	return (
		<Container
			ui={{
				layout: "vertical-flex",
				width: "full",
				...ui,
			}}
			{...props}
		>
			<TransactionToolbar
				transactionId={transactionId}
				side={side}
			/>
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
