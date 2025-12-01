import type { tListingTransactionMessage } from "@zbav-se.me/sdk/api/user";
import type { ChatInput } from "@zbav-se.me/ui/chat";
import type { FC } from "react";
import { match } from "ts-pattern";
import { BuyerInfoButton } from "../../../listing-transaction/button/BuyerInfoButton";
import { RejectButton } from "../../../listing-transaction/button/RejectButton";
import { SellerInfoButton } from "../../../listing-transaction/button/SellerInfoButton";
import type { useSideSwitch } from "../../../listing-transaction/useSideSwitch";
import { GalleryUploadButton } from "../../../photo/GalleryUploadButton";

export namespace MessageMenu {
	export interface Props {
		locale: string;
		type: useSideSwitch.Type;
		listingTransactionMessage: tListingTransactionMessage;
		menuState: ChatInput.Menu.State;
	}
}

export const MessageMenu: FC<MessageMenu.Props> = ({
	locale,
	type,
	listingTransactionMessage,
	menuState,
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

					<SellerInfoButton
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

					<BuyerInfoButton
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

					<BuyerInfoButton
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

					<SellerInfoButton
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
