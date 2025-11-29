import type { tListingTransactionMessage } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";
import { MessageButton } from "../../../listing-transaction/button/MessageButton";
import type { useSideSwitch } from "../../../listing-transaction/useSideSwitch";
import type { TransactionChat } from "../../TransactionChat";

export namespace MessageMenu {
	export interface Props {
		locale: string;
		type: useSideSwitch.Type;
		listingTransactionMessage: tListingTransactionMessage;
		components: TransactionChat.Components;
	}
}

export const MessageMenu: FC<MessageMenu.Props> = ({
	locale,
	type,
	listingTransactionMessage,
	components,
}) => {
	return match(type)
		.with("buyer", () => {
			return (
				<>
					<MessageButton
						listingTransactionId={listingTransactionMessage.listingTransactionId}
					/>

					<components.SellerInfoButton
						locale={locale}
						log={listingTransactionMessage}
					/>
				</>
			);
		})
		.with("buyer-to-seller", () => {
			return (
				<>
					<MessageButton
						listingTransactionId={listingTransactionMessage.listingTransactionId}
					/>

					<components.BuyerInfoButton
						locale={locale}
						log={listingTransactionMessage}
					/>
				</>
			);
		})
		.with("seller", () => {
			return (
				<>
					<MessageButton
						listingTransactionId={listingTransactionMessage.listingTransactionId}
					/>

					<components.BuyerInfoButton
						locale={locale}
						log={listingTransactionMessage}
					/>
				</>
			);
		})
		.with("seller-to-buyer", () => {
			return (
				<>
					<MessageButton
						listingTransactionId={listingTransactionMessage.listingTransactionId}
					/>

					<components.SellerInfoButton
						locale={locale}
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
