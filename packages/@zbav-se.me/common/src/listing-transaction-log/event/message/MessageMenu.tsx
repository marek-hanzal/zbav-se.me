import type { tListingTransactionMessage } from "@zbav-se.me/sdk/api/user";
import type { ChatInput } from "@zbav-se.me/ui/chat";
import type { FC } from "react";
import { match } from "ts-pattern";
import { RejectButton } from "../../../listing-transaction/button/RejectButton";
import type { useSideSwitch } from "../../../listing-transaction/useSideSwitch";
import type { TransactionChat } from "../../TransactionChat";

export namespace MessageMenu {
	export interface Props {
		locale: string;
		type: useSideSwitch.Type;
		listingTransactionMessage: tListingTransactionMessage;
		menuState: ChatInput.Menu.State;
		components: TransactionChat.Components;
	}
}

export const MessageMenu: FC<MessageMenu.Props> = ({
	locale,
	type,
	listingTransactionMessage,
	menuState,
	components,
}) => {
	return match(type)
		.with("buyer", () => {
			return (
				<>
					<RejectButton
						menuState={menuState}
						log={listingTransactionMessage}
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
					<RejectButton
						menuState={menuState}
						log={listingTransactionMessage}
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
					<RejectButton
						menuState={menuState}
						log={listingTransactionMessage}
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
					<RejectButton
						menuState={menuState}
						log={listingTransactionMessage}
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
