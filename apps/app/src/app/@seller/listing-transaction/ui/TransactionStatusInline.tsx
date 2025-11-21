import { Tx } from "@use-pico/client/ui/tx";
import type { tListingTransactionStatus } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";

export namespace TransactionStatusInline {
	export interface Props extends Omit<Tx.Props, "label"> {
		transactionStatus: tListingTransactionStatus;
	}
}

export const TransactionStatusInline: FC<TransactionStatusInline.Props> = ({
	transactionStatus,
	...props
}) => {
	return (
		<Tx
			font={"normal"}
			size={"sm"}
			label={match(transactionStatus)
				.with("request", () => "Transaction requested - seller (label)")
				.with("accepted", () => "Transaction accepted - seller (label)")
				.with("rejected", () => "Transaction rejected - seller (label)")
				.with("success", () => "Transaction successful - seller (label)")
				.with("closed", () => "Transaction closed - seller (label)")
				.with("expired", () => "Transaction expired - seller (label)")
				.exhaustive()}
			{...props}
		/>
	);
};
