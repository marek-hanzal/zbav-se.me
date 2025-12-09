import { Tx } from "@use-pico/client/ui/tx";
import type { tListingTransactionStatusEnum } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";

export namespace TransactionStatusInline {
	export interface Props extends Omit<Tx.Props, "label"> {
		transactionStatus: tListingTransactionStatusEnum;
	}
}

export const TransactionStatusInline: FC<TransactionStatusInline.Props> = ({
	transactionStatus,
	...props
}) => {
	return (
		<Tx
			label={match(transactionStatus)
				.with("request", () => "Transaction requested - seller (label)")
				.with("accepted", () => "Transaction accepted - seller (label)")
				.with("rejected", () => "Transaction rejected - seller (label)")
				.with("success", () => "Transaction successful - seller (label)")
				.with("closed", () => "Transaction closed - seller (label)")
				.with("expired", () => "Transaction expired - seller (label)")
				.exhaustive()}
			ui={{
				size: "sm",
				font: "normal",
			}}
			{...props}
		/>
	);
};
