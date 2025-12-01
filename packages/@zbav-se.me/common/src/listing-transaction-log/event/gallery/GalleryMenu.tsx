import type { tListingTransaction, tListingTransactionGallery } from "@zbav-se.me/sdk/api/user";
import type { ChatInput } from "@zbav-se.me/ui/chat";
import { type FC, useId } from "react";
import { match } from "ts-pattern";
import { ListingDetailButton } from "../../../listing/ListingDetailButton";
import { BuyerInfoButton } from "../../../listing-transaction/button/BuyerInfoButton";
import { RejectButton } from "../../../listing-transaction/button/RejectButton";
import { SellerInfoButton } from "../../../listing-transaction/button/SellerInfoButton";
import type { useSideSwitch } from "../../../listing-transaction/useSideSwitch";
import { GalleryUploadButton } from "../../../photo/GalleryUploadButton";

export namespace GalleryMenu {
	export interface Props {
		locale: string;
		type: useSideSwitch.Type;
		menuState: ChatInput.Menu.State;
		listingTransaction: tListingTransaction;
		listingTransactionGallery: tListingTransactionGallery;
	}
}

export const GalleryMenu: FC<GalleryMenu.Props> = ({
	locale,
	type,
	listingTransaction,
	listingTransactionGallery,
	menuState,
}) => {
	const [, setMenuState] = menuState;
	const listingSheetId = useId();

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

					<ListingDetailButton
						locale={locale}
						listing={listingTransaction.listingId}
						detailSheetId={listingSheetId}
					/>

					<SellerInfoButton
						locale={locale}
						log={listingTransactionGallery}
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
						listingTransactionId={listingTransactionGallery.listingTransactionId}
						onSuccess={() => {
							setMenuState(false);
						}}
						onCancel={() => {
							setMenuState(false);
						}}
					/>

					<ListingDetailButton
						locale={locale}
						listing={listingTransaction.listingId}
						detailSheetId={listingSheetId}
					/>

					<SellerInfoButton
						locale={locale}
						log={listingTransactionGallery}
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
						listingTransactionId={listingTransactionGallery.listingTransactionId}
						onSuccess={() => {
							setMenuState(false);
						}}
						onCancel={() => {
							setMenuState(false);
						}}
					/>

					<ListingDetailButton
						locale={locale}
						listing={listingTransaction.listingId}
						detailSheetId={listingSheetId}
					/>

					<BuyerInfoButton
						locale={locale}
						log={listingTransactionGallery}
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
						listingTransactionId={listingTransactionGallery.listingTransactionId}
						onSuccess={() => {
							setMenuState(false);
						}}
						onCancel={() => {
							setMenuState(false);
						}}
					/>

					<ListingDetailButton
						locale={locale}
						listing={listingTransaction.listingId}
						detailSheetId={listingSheetId}
					/>

					<BuyerInfoButton
						locale={locale}
						log={listingTransactionGallery}
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
