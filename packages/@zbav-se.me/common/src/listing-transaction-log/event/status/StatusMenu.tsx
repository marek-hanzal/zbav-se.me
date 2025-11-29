import type { tListingTransactionStatus } from "@zbav-se.me/sdk/api/user";
import type { ChatInput } from "@zbav-se.me/ui/chat";
import { type FC, useId } from "react";
import { match } from "ts-pattern";
import { AcceptButton } from "../../../listing-transaction/button/AcceptButton";
import { RejectButton } from "../../../listing-transaction/button/RejectButton";
import type { useSideSwitch } from "../../../listing-transaction/useSideSwitch";
import type { TransactionChat } from "../../TransactionChat";

export namespace StatusMenu {
	export interface Props {
		locale: string;
		type: useSideSwitch.Type;
		listingTransactionStatus: tListingTransactionStatus;
		menuState: ChatInput.Menu.State;
		components: TransactionChat.Components;
	}
}

export const StatusMenu: FC<StatusMenu.Props> = ({
	locale,
	type,
	listingTransactionStatus,
	menuState,
	components,
}) => {
	const listingSheetId = useId();

	return match(type)
		.with("buyer", () => {
			return match(listingTransactionStatus.status)
				.with("request", () => {
					return (
						<>
							<components.SellerInfoButton
								locale={locale}
								log={listingTransactionStatus}
							/>

							<RejectButton
								menuState={menuState}
								log={listingTransactionStatus}
							/>

							<components.ListingDetailButton modalRootId={listingSheetId} />
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
					<components.BuyerInfoButton
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

					<components.ListingDetailButton modalRootId={listingSheetId} />
				</>
			);
		})
		.with("seller", () => {
			return (
				<>
					<components.BuyerInfoButton
						locale={locale}
						log={listingTransactionStatus}
					/>

					<RejectButton
						menuState={menuState}
						log={listingTransactionStatus}
					/>

					<components.ListingDetailButton modalRootId={listingSheetId} />
				</>
			);
		})
		.with("seller-to-buyer", () => {
			return (
				<>
					<components.SellerInfoButton
						locale={locale}
						log={listingTransactionStatus}
					/>

					<RejectButton
						menuState={menuState}
						log={listingTransactionStatus}
					/>

					<components.ListingDetailButton modalRootId={listingSheetId} />
				</>
			);
		})
		.with("unknown", () => {
			return "unknown";
		})
		.exhaustive();
};
