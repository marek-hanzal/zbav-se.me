import type { tListingTransactionMessage } from "@zbav-se.me/sdk/api/user";
import { withListingTransactionGalleryCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import type { ChatInput } from "@zbav-se.me/ui/chat";
import { type FC, useState } from "react";
import { match } from "ts-pattern";
import { RejectButton } from "~/app/listing-transaction/ui/button/RejectButton";
import type { useSideSwitch } from "~/app/listing-transaction/ui/useSideSwitch";
import { GalleryUploadButton } from "~/app/photo/ui/GalleryUploadButton";

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
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);

	return match(type)
		.with("buyer", () => {
			return (
				<>
					<GalleryUploadButton
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
						state={{
							value: isGalleryOpen,
							set: setIsGalleryOpen,
						}}
						ui={{
							tone: "secondary",
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
						state={{
							value: isGalleryOpen,
							set: setIsGalleryOpen,
						}}
						ui={{
							tone: "secondary",
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
						state={{
							value: isGalleryOpen,
							set: setIsGalleryOpen,
						}}
						ui={{
							tone: "secondary",
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
						state={{
							value: isGalleryOpen,
							set: setIsGalleryOpen,
						}}
						ui={{
							tone: "secondary",
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
