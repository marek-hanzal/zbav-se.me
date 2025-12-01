import type { tListingTransactionGallery } from "@zbav-se.me/sdk/api/user";
import { withListingTransactionGalleryCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import type { ChatInput } from "@zbav-se.me/ui/chat";
import type { FC } from "react";
import { match } from "ts-pattern";
import { RejectButton } from "../../../listing-transaction/button/RejectButton";
import type { useSideSwitch } from "../../../listing-transaction/useSideSwitch";
import { GalleryUploadButton } from "../../../photo/GalleryUploadButton";

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
