import type { tListingTransactionMessage } from "@zbav-se.me/sdk/api/user";
import type { ChatInput } from "@zbav-se.me/ui/chat";
import type { FC } from "react";
import { match } from "ts-pattern";
import { RejectButton } from "../../../listing-transaction/button/RejectButton";
import type { useSideSwitch } from "../../../listing-transaction/useSideSwitch";
import { GalleryUploadButton } from "../../../photo/GalleryUploadButton";
import type { TransactionChat } from "../../TransactionChat";

export namespace MessageMenu {
	export interface Props {
		locale: string;
		type: useSideSwitch.Type;
		listingTransactionMessage: tListingTransactionMessage;
		menuState: ChatInput.Menu.State;
		components: TransactionChat.Components;
	}
}

export const MessageMenu: FC<MessageMenu.Props> = ({
	locale,
	type,
	listingTransactionMessage,
	menuState,
	components,
}) => {
	const [, setMenuState] = menuState;

	return match(type)
		.with("buyer", () => {
			return (
				<>
					<GalleryUploadButton
						listingTransactionId={listingTransactionMessage.listingTransactionId}
						onSuccess={() => {
							setMenuState(false);
						}}
						onCancel={() => {
							setMenuState(false);
						}}
					/>

					<components.SellerInfoButton
						locale={locale}
						log={listingTransactionMessage}
					/>

					<RejectButton
						menuState={menuState}
						log={listingTransactionMessage}
					/>
				</>
			);
		})
		.with("buyer-to-seller", () => {
			return (
				<>
					<GalleryUploadButton
						listingTransactionId={listingTransactionMessage.listingTransactionId}
						onSuccess={() => {
							setMenuState(false);
						}}
						onCancel={() => {
							setMenuState(false);
						}}
					/>

					<components.BuyerInfoButton
						locale={locale}
						log={listingTransactionMessage}
					/>

					<RejectButton
						menuState={menuState}
						log={listingTransactionMessage}
					/>
				</>
			);
		})
		.with("seller", () => {
			return (
				<>
					<GalleryUploadButton
						listingTransactionId={listingTransactionMessage.listingTransactionId}
						onSuccess={() => {
							setMenuState(false);
						}}
						onCancel={() => {
							setMenuState(false);
						}}
					/>

					<components.BuyerInfoButton
						locale={locale}
						log={listingTransactionMessage}
					/>

					<RejectButton
						menuState={menuState}
						log={listingTransactionMessage}
					/>
				</>
			);
		})
		.with("seller-to-buyer", () => {
			return (
				<>
					<GalleryUploadButton
						listingTransactionId={listingTransactionMessage.listingTransactionId}
						onSuccess={() => {
							setMenuState(false);
						}}
						onCancel={() => {
							setMenuState(false);
						}}
					/>

					<components.SellerInfoButton
						locale={locale}
						log={listingTransactionMessage}
					/>

					<RejectButton
						menuState={menuState}
						log={listingTransactionMessage}
					/>
				</>
			);
		})
		.with("unknown", () => {
			return "unknown";
		})
		.exhaustive();
};
