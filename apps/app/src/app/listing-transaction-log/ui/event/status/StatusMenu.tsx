import type { tListingTransactionStatus } from "@zbav-se.me/sdk/api/user";
import type { ChatInput } from "@zbav-se.me/ui/chat";
import type { FC } from "react";
import { match } from "ts-pattern";
import { AcceptButton } from "~/app/listing-transaction/ui/button/AcceptButton";
import { BuyerInfoButton } from "~/app/listing-transaction/ui/button/BuyerInfoButton";
import { RejectButton } from "~/app/listing-transaction/ui/button/RejectButton";
import { SellerInfoButton } from "~/app/listing-transaction/ui/button/SellerInfoButton";
import type { useSideSwitch } from "~/app/listing-transaction/ui/useSideSwitch";

export namespace StatusMenu {
	export interface Props {
		locale: string;
		type: useSideSwitch.Type;
		listingTransactionStatus: tListingTransactionStatus;
		menuState: ChatInput.Menu.State;
	}
}

export const StatusMenu: FC<StatusMenu.Props> = ({
	locale,
	type,
	listingTransactionStatus,
	menuState,
}) => {
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
				</>
			);
		})
		.with("unknown", () => {
			return "unknown";
		})
		.exhaustive();
};
