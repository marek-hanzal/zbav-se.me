import { Container } from "@use-pico/client/ui/container";
import type { tTransaction } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";
import { OpenMessage } from "~/app/transaction/ui/transaction-status/OpenMessage";
import { PendingMessage } from "~/app/transaction/ui/transaction-status/PendingMessage";
import { ResolvedMessage } from "~/app/transaction/ui/transaction-status/ResolvedMessage";

export namespace TransactionMessage {
	export interface Props extends Container.Props {
		transaction: tTransaction;
	}
}

export const TransactionMessage: FC<TransactionMessage.Props> = ({ transaction, ...props }) => {
	return (
		<Container {...props}>
			{match(transaction.status)
				.with("pending", () => {
					return <PendingMessage transaction={transaction} />;
				})
				.with("open", () => {
					return <OpenMessage transaction={transaction} />;
				})
				.with("resolved", () => {
					return <ResolvedMessage transaction={transaction} />;
				})
				.with("rejected", "expired", "success", () => {
					return null;
				})
				.exhaustive()}
		</Container>
	);
};
