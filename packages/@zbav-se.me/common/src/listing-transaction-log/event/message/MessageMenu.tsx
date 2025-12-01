import type { tListingTransactionMessage } from "@zbav-se.me/sdk/api/user";
import { withListingTransactionGalleryCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import type { ChatInput } from "@zbav-se.me/ui/chat";
import type { FC } from "react";
import { match } from "ts-pattern";
import { RejectButton } from "../../../listing-transaction/button/RejectButton";
import type { useSideSwitch } from "../../../listing-transaction/useSideSwitch";
import { GalleryUploadButton } from "../../../photo/GalleryUploadButton";

export namespace MessageMenu {
	export interface Props {
		type: useSideSwitch.Type;
		listingTransactionMessage: tListingTransactionMessage;
		menuState: ChatInput.Menu.State;
	}
}

export const MessageMenu: FC<MessageMenu.Props> = ({
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
						tone={"secondary"}
						withMutation={withListingTransactionGalleryCreateMutation}
						toMutation={(uploadIds) => ({
							listingTransactionId: listingTransactionMessage.listingTransactionId,
							uploadIds,
						})}
						onSuccess={() => {
							setMenuState(false);
						}}
						onCancel={() => {
							setMenuState(false);
						}}
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
						tone={"secondary"}
						withMutation={withListingTransactionGalleryCreateMutation}
						toMutation={(uploadIds) => ({
							listingTransactionId: listingTransactionMessage.listingTransactionId,
							uploadIds,
						})}
						onSuccess={() => {
							setMenuState(false);
						}}
						onCancel={() => {
							setMenuState(false);
						}}
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
						tone={"secondary"}
						withMutation={withListingTransactionGalleryCreateMutation}
						toMutation={(uploadIds) => ({
							listingTransactionId: listingTransactionMessage.listingTransactionId,
							uploadIds,
						})}
						onSuccess={() => {
							setMenuState(false);
						}}
						onCancel={() => {
							setMenuState(false);
						}}
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
						tone={"secondary"}
						withMutation={withListingTransactionGalleryCreateMutation}
						toMutation={(uploadIds) => ({
							listingTransactionId: listingTransactionMessage.listingTransactionId,
							uploadIds,
						})}
						onSuccess={() => {
							setMenuState(false);
						}}
						onCancel={() => {
							setMenuState(false);
						}}
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
