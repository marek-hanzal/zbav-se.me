import type { tListingTransactionMessage, tUserSideEnum } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";
import { MessageButton } from "../../../listing-transaction/button/MessageButton";
import type { useSideSwitch } from "../../../listing-transaction/useSideSwitch";
import type { TransactionLogList } from "../../TransactionLogList";

export namespace MessageMenu {
	export interface Props {
		locale: string;
		side: tUserSideEnum;
		type: useSideSwitch.Type;
		listingTransactionMessage: tListingTransactionMessage;
		components: TransactionLogList.Components;
	}
}

export const MessageMenu: FC<MessageMenu.Props> = ({
	locale,
	side,
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
