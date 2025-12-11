import type { tTransactionStatus } from "@zbav-se.me/sdk/api/user";
import type { ChatInput } from "@zbav-se.me/ui/chat";
import type { FC } from "react";
import { match } from "ts-pattern";
import { AcceptButton } from "~/app/transaction/ui/button/AcceptButton";
import { BuyerInfoButton } from "~/app/transaction/ui/button/BuyerInfoButton";
import { RejectButton } from "~/app/transaction/ui/button/RejectButton";
import { SellerInfoButton } from "~/app/transaction/ui/button/SellerInfoButton";
import type { useSideSwitch } from "~/app/transaction/ui/useSideSwitch";

export namespace StatusMenu {
	export interface Props {
		locale: string;
		type: useSideSwitch.Type;
		transactionStatus: tTransactionStatus;
		menuState: ChatInput.Menu.State;
	}
}

export const StatusMenu: FC<StatusMenu.Props> = ({
	locale,
	type,
	transactionStatus,
	menuState,
}) => {
	return match(type)
		.with("buyer", () => {
			return match(transactionStatus.status)
				.with("request", () => {
					return (
						<>
							<SellerInfoButton
								locale={locale}
								log={transactionStatus}
							/>

							<RejectButton
								menuState={menuState}
								log={transactionStatus}
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
						log={transactionStatus}
					/>

					<AcceptButton
						menuState={menuState}
						log={transactionStatus}
					/>

					<RejectButton
						menuState={menuState}
						log={transactionStatus}
					/>
				</>
			);
		})
		.with("seller", () => {
			return (
				<>
					<BuyerInfoButton
						locale={locale}
						log={transactionStatus}
					/>

					<RejectButton
						menuState={menuState}
						log={transactionStatus}
					/>
				</>
			);
		})
		.with("seller-to-buyer", () => {
			return (
				<>
					<SellerInfoButton
						locale={locale}
						log={transactionStatus}
					/>

					<RejectButton
						menuState={menuState}
						log={transactionStatus}
					/>
				</>
			);
		})
		.with("unknown", () => {
			return "unknown";
		})
		.exhaustive();
};
