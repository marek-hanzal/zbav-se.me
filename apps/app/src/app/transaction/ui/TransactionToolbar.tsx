import { Container } from "@use-pico/client/ui/container";
import type { tTransaction } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";
import { OpenToolbar } from "~/app/transaction/ui/transaction-status/OpenToolbar";
import { PendingToolbar } from "~/app/transaction/ui/transaction-status/PendingToolbar";

export namespace TransactionToolbar {
	export interface Props extends Container.Props {
		transaction: tTransaction;
	}
}

export const TransactionToolbar: FC<TransactionToolbar.Props> = ({ transaction, ui, ...props }) => {
	return (
		<Container
			ui={{
				flow: "horizontal",
				opacity: "low",
				justify: "center",
				items: "center",
				gap: "default",
				...ui,
			}}
			className={[
				"py-1",
			]}
			{...props}
		>
			{match(transaction.status)
				.with("open", () => {
					return <OpenToolbar transaction={transaction} />;
				})
				.with("pending", () => {
					return <PendingToolbar transaction={transaction} />;
				})
				.with("rejected", "cancelled", "expired", "completed", () => {
					return "rejected-cancelled-expired";
				})
				.exhaustive()}
		</Container>
	);
};
