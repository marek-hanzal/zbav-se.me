import type { tListingTransactionGallery } from "@zbav-se.me/sdk/api/user";
import type { ChatInput } from "@zbav-se.me/ui/chat";
import type { FC } from "react";
import { match } from "ts-pattern";
import { BuyerInfoButton } from "../../../listing-transaction/button/BuyerInfoButton";
import { SellerInfoButton } from "../../../listing-transaction/button/SellerInfoButton";
import type { useSideSwitch } from "../../../listing-transaction/useSideSwitch";
import { GalleryUploadButton } from "../../../photo/GalleryUploadButton";

export namespace GalleryMenu {
	export interface Props {
		locale: string;
		type: useSideSwitch.Type;
		menuState: ChatInput.Menu.State;
		listingTransactionGallery: tListingTransactionGallery;
	}
}

export const GalleryMenu: FC<GalleryMenu.Props> = ({
	locale,
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
						listingTransactionId={listingTransactionGallery.listingTransactionId}
						onSuccess={() => {
							setMenuState(false);
						}}
						onCancel={() => {
							setMenuState(false);
						}}
					/>

					<SellerInfoButton
						locale={locale}
						log={listingTransactionGallery}
					/>
				</>
			);
		})
		.with("buyer-to-seller", () => {
			return (
				<>
					<GalleryUploadButton
						listingTransactionId={listingTransactionGallery.listingTransactionId}
						onSuccess={() => {
							setMenuState(false);
						}}
						onCancel={() => {
							setMenuState(false);
						}}
					/>

					<SellerInfoButton
						locale={locale}
						log={listingTransactionGallery}
					/>
				</>
			);
		})
		.with("seller", () => {
			return (
				<>
					<GalleryUploadButton
						listingTransactionId={listingTransactionGallery.listingTransactionId}
						onSuccess={() => {
							setMenuState(false);
						}}
						onCancel={() => {
							setMenuState(false);
						}}
					/>

					<BuyerInfoButton
						locale={locale}
						log={listingTransactionGallery}
					/>
				</>
			);
		})
		.with("seller-to-buyer", () => {
			return (
				<>
					<GalleryUploadButton
						listingTransactionId={listingTransactionGallery.listingTransactionId}
						onSuccess={() => {
							setMenuState(false);
						}}
						onCancel={() => {
							setMenuState(false);
						}}
					/>

					<BuyerInfoButton
						locale={locale}
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
