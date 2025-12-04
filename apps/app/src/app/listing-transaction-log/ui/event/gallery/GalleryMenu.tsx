import type { tListingTransactionGallery } from "@zbav-se.me/sdk/api/user";
import { withListingTransactionGalleryCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import type { ChatInput } from "@zbav-se.me/ui/chat";
import { type FC, useState } from "react";
import { match } from "ts-pattern";
import { RejectButton } from "~/app/listing-transaction/ui/button/RejectButton";
import type { useSideSwitch } from "~/app/listing-transaction/ui/useSideSwitch";
import { GalleryUploadButton } from "~/app/photo/ui/GalleryUploadButton";

export namespace GalleryMenu {
	export interface Props {
		type: useSideSwitch.Type;
		menuState: ChatInput.Menu.State;
		listingTransactionGallery: tListingTransactionGallery;
	}
}

export const GalleryMenu: FC<GalleryMenu.Props> = ({
	type,
	listingTransactionGallery,
	menuState,
}) => {
	const [, setMenuState] = menuState;
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);

	return match(type)
		.with("buyer", () => {
			return (
				<>
					<GalleryUploadButton
						tone={"secondary"}
						withMutation={withListingTransactionGalleryCreateMutation}
						toMutation={(uploadIds) => ({
							listingTransactionId: listingTransactionGallery.listingTransactionId,
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
					/>

					<RejectButton
						menuState={menuState}
						log={listingTransactionGallery}
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
							listingTransactionId: listingTransactionGallery.listingTransactionId,
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
					/>

					<RejectButton
						menuState={menuState}
						log={listingTransactionGallery}
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
							listingTransactionId: listingTransactionGallery.listingTransactionId,
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
					/>

					<RejectButton
						menuState={menuState}
						log={listingTransactionGallery}
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
							listingTransactionId: listingTransactionGallery.listingTransactionId,
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
					/>

					<RejectButton
						menuState={menuState}
						log={listingTransactionGallery}
					/>
				</>
			);
		})
		.with("unknown", () => {
			return "unknown";
		})
		.exhaustive();
};
