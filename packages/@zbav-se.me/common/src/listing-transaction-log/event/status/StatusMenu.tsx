import type { tListingTransaction, tListingTransactionStatus } from "@zbav-se.me/sdk/api/user";
import type { ChatInput } from "@zbav-se.me/ui/chat";
import { type FC, useId } from "react";
import { match } from "ts-pattern";
import { ListingDetailButton } from "../../../listing/ListingDetailButton";
import { AcceptButton } from "../../../listing-transaction/button/AcceptButton";
import { BuyerInfoButton } from "../../../listing-transaction/button/BuyerInfoButton";
import { RejectButton } from "../../../listing-transaction/button/RejectButton";
import { SellerInfoButton } from "../../../listing-transaction/button/SellerInfoButton";
import type { useSideSwitch } from "../../../listing-transaction/useSideSwitch";

export namespace StatusMenu {
	export interface Props {
		locale: string;
		type: useSideSwitch.Type;
		listingTransaction: tListingTransaction;
		listingTransactionStatus: tListingTransactionStatus;
		menuState: ChatInput.Menu.State;
	}
}

export const StatusMenu: FC<StatusMenu.Props> = ({
	locale,
	type,
	listingTransaction,
	listingTransactionStatus,
	menuState,
}) => {
	const listingSheetId = useId();

	return match(type)
		.with("buyer", () => {
			return match(listingTransactionStatus.status)
				.with("request", () => {
					return (
						<>
							<SellerInfoButton
								locale={locale}
								log={listingTransactionStatus}
							/>

							<RejectButton
								menuState={menuState}
								log={listingTransactionStatus}
							/>

							<ListingDetailButton
								locale={locale}
								listing={listingTransaction.listingId}
								detailSheetId={listingSheetId}
							/>
						</>
					);
				})
				.with("accepted", "closed", "expired", "success", "rejected", () => {
					return null;
				})
				.exhaustive();
		})
		.with("buyer-to-seller", () => {
			return (
				<>
					<BuyerInfoButton
						locale={locale}
						log={listingTransactionStatus}
					/>

					<AcceptButton
						menuState={menuState}
						log={listingTransactionStatus}
					/>

					<RejectButton
						menuState={menuState}
						log={listingTransactionStatus}
					/>

					<ListingDetailButton
						locale={locale}
						listing={listingTransaction.listingId}
						detailSheetId={listingSheetId}
					/>
				</>
			);
		})
		.with("seller", () => {
			return (
				<>
					<BuyerInfoButton
						locale={locale}
						log={listingTransactionStatus}
					/>

					<RejectButton
						menuState={menuState}
						log={listingTransactionStatus}
					/>

					<ListingDetailButton
						locale={locale}
						listing={listingTransaction.listingId}
						detailSheetId={listingSheetId}
					/>
				</>
			);
		})
		.with("seller-to-buyer", () => {
			return (
				<>
					<SellerInfoButton
						locale={locale}
						log={listingTransactionStatus}
					/>

					<RejectButton
						menuState={menuState}
						log={listingTransactionStatus}
					/>

					<ListingDetailButton
						locale={locale}
						listing={listingTransaction.listingId}
						detailSheetId={listingSheetId}
					/>
				</>
			);
		})
		.with("unknown", () => {
			return "unknown";
		})
		.exhaustive();
};
