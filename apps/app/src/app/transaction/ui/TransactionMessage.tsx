import { Container } from "@use-pico/client/ui/container";
import type { tTransaction } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";
import { OpenMessage } from "~/app/transaction/ui/transaction-status/OpenMessage";
import { PendingMessage } from "~/app/transaction/ui/transaction-status/PendingMessage";

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
				.with("rejected", "cancelled", "expired", "completed", () => {
					return "rejected-cancelled-expired-completed";
				})
				.exhaustive()}
		</Container>
	);
};
