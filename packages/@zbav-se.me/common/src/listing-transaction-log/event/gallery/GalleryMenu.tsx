import type { tListingTransactionGallery } from "@zbav-se.me/sdk/api/user";
import type { ChatInput } from "@zbav-se.me/ui/chat";
import { type FC, useId } from "react";
import { match } from "ts-pattern";
import type { useSideSwitch } from "../../../listing-transaction/useSideSwitch";
import { GalleryUploadButton } from "../../../photo/GalleryUploadButton";
import type { TransactionChat } from "../../TransactionChat";

export namespace GalleryMenu {
	export interface Props {
		locale: string;
		type: useSideSwitch.Type;
		listingTransactionGallery: tListingTransactionGallery;
		menuState: ChatInput.Menu.State;
		components: TransactionChat.Components;
	}
}

export const GalleryMenu: FC<GalleryMenu.Props> = ({
	locale,
	type,
	listingTransactionGallery,
	menuState,
	components,
}) => {
	const listingSheetId = useId();

	return match(type)
		.with("buyer", () => {
			return (
				<>
					<GalleryUploadButton
						listingTransactionId={listingTransactionGallery.listingTransactionId}
					/>

					<components.SellerInfoButton
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
					/>

					<components.SellerInfoButton
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
					/>

					<components.BuyerInfoButton
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
					/>

					<components.BuyerInfoButton
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
