import { translator } from "@use-pico/common/translator";
import {
	type tListingTransaction,
	type tListingTransactionLog,
	type tUserSideEnum,
	zListingTransactionGallery,
	zListingTransactionMessage,
	zListingTransactionStatus,
} from "@zbav-se.me/sdk/api/user";
import { withListingTransactionMessageCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import { ChatInput } from "@zbav-se.me/ui/chat";
import { type FC, useState } from "react";
import { match } from "ts-pattern";
import { useSideSwitch } from "../listing-transaction/useSideSwitch";
import { GalleryMenu } from "./event/gallery/GalleryMenu";
import { MessageMenu } from "./event/message/MessageMenu";
import { StatusMenu } from "./event/status/StatusMenu";

export namespace TransactionChat {
	export interface Props {
		locale: string;
		side: tUserSideEnum;
		listingTransaction: tListingTransaction;
		listingTransactionLog: tListingTransactionLog;
	}
}

export const TransactionChat: FC<TransactionChat.Props> = ({
	locale,
	side,
	listingTransaction,
	listingTransactionLog,
}) => {
	const menuState = useState(false);
	const [message, setMessage] = useState("");

	const { type } = useSideSwitch({
		side,
		actor: listingTransactionLog.side,
	});

	const messageCreateMutation = withListingTransactionMessageCreateMutation.useMutation();

	return (
		<ChatInput
			value={message}
			onChange={setMessage}
			onSubmit={(message) => {
				messageCreateMutation.mutate({
					listingTransactionId: listingTransactionLog.listingTransactionId,
					message,
				});
			}}
			placeholder={translator.text("Enter your message (placeholder)")}
			loading={messageCreateMutation.isPending}
			menu={{
				state: menuState,
				content: match(listingTransactionLog.event)
					.with("status", () => {
						const status = zListingTransactionStatus.parse(listingTransactionLog);

						return (
							<StatusMenu
								locale={locale}
								type={type}
								listingTransaction={listingTransaction}
								listingTransactionStatus={status}
								menuState={menuState}
							/>
						);
					})
					.with("message", () => {
						const message = zListingTransactionMessage.parse(listingTransactionLog);

						return (
							<MessageMenu
								locale={locale}
								type={type}
								listingTransactionMessage={message}
								menuState={menuState}
							/>
						);
					})
					.with("gallery", () => {
						const gallery = zListingTransactionGallery.parse(listingTransactionLog);

						return (
							<GalleryMenu
								type={type}
								listingTransactionGallery={gallery}
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
		/>
	);
};
