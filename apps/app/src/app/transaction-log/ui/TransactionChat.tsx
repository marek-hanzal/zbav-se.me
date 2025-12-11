import { translator } from "@use-pico/common/translator";
import {
	type tTransactionLog,
	type tUserSideEnum,
	zTransactionGallery,
	zTransactionMessage,
	zTransactionStatus,
} from "@zbav-se.me/sdk/api/user";
import { withTransactionMessageCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import { ChatInput } from "@zbav-se.me/ui/chat";
import { type FC, useState } from "react";
import { match } from "ts-pattern";
import { useSideSwitch } from "~/app/transaction/ui/useSideSwitch";
import { GalleryMenu } from "./event/gallery/GalleryMenu";
import { MessageMenu } from "./event/message/MessageMenu";
import { StatusMenu } from "./event/status/StatusMenu";

export namespace TransactionChat {
	export interface Props extends Partial<ChatInput.Props> {
		locale: string;
		side: tUserSideEnum;
		transactionLog: tTransactionLog;
	}
}

export const TransactionChat: FC<TransactionChat.Props> = ({
	locale,
	side,
	transactionLog,
	...props
}) => {
	const menuState = useState(false);
	const [message, setMessage] = useState("");

	const { type } = useSideSwitch({
		side,
		actor: transactionLog.side,
	});

	const messageCreateMutation = withTransactionMessageCreateMutation.useMutation();

	return (
		<ChatInput
			data-ui={`ChatInput-${type}`}
			value={message}
			onChange={setMessage}
			onSubmit={(message) => {
				messageCreateMutation.mutate({
					transactionId: transactionLog.transactionId,
					message,
				});
			}}
			placeholder={translator.text("Enter your message (placeholder)")}
			loading={messageCreateMutation.isPending}
			menu={{
				state: menuState,
				content: match(transactionLog.event)
					.with("status", () => {
						const status = zTransactionStatus.parse(transactionLog);

						return (
							<StatusMenu
								locale={locale}
								type={type}
								transactionStatus={status}
								menuState={menuState}
							/>
						);
					})
					.with("message", () => {
						const message = zTransactionMessage.parse(transactionLog);

						return (
							<MessageMenu
								type={type}
								transactionMessage={message}
								menuState={menuState}
							/>
						);
					})
					.with("gallery", () => {
						const gallery = zTransactionGallery.parse(transactionLog);

						return (
							<GalleryMenu
								type={type}
								transactionGallery={gallery}
								menuState={menuState}
							/>
						);
					})
					.with("location", () => {
						return "not yet";
					})
					.exhaustive(),
				props: {
					detent: "content",
				},
			}}
			{...props}
		/>
	);
};
