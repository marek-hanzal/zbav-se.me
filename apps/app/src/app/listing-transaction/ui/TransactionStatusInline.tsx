import { Tx } from "@use-pico/client/ui/tx";
import type { tListingTransactionStatus, tUserSide } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";

export namespace TransactionStatusInline {
	export interface Props extends Omit<Tx.Props, "label"> {
		side: tUserSide;
		transactionStatus: tListingTransactionStatus;
	}
}

export const TransactionStatusInline: FC<TransactionStatusInline.Props> = ({
	side,
	transactionStatus,
	...props
}) => {
	return (
		<Tx
			font={"normal"}
			size={"sm"}
			label={match(side)
				.with("buyer", () => {
					return match(transactionStatus)
						.with("request", () => "Transaction requested (label)")
						.with("accepted", () => "Transaction accepted (label)")
						.with("rejected", () => "Transaction rejected (label)")
						.with("success", () => "Transaction successful (label)")
						.with("closed", () => "Transaction closed (label)")
						.with("expired", () => "Transaction expired (label)")
						.exhaustive();
				})
				.with("seller", () => {
					return match(transactionStatus)
						.with("request", () => "Transaction requested - seller (label)")
						.with("accepted", () => "Transaction accepted - seller (label)")
						.with("rejected", () => "Transaction rejected - seller (label)")
						.with("success", () => "Transaction successful - seller (label)")
						.with("closed", () => "Transaction closed - seller (label)")
						.with("expired", () => "Transaction expired - seller (label)")
						.exhaustive();
				})
				.exhaustive()}
			{...props}
		/>
	);
};
