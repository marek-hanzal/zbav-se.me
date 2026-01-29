import { Container } from "@use-pico/client/ui/container";
import type { tTransaction } from "@zbav-se.me/sdk/api/buyer-user";
import type { FC } from "react";
import { match } from "ts-pattern";
import { DisputeToolbar } from "~/app/@common/transaction/ui/transaction-status/DisputeToolbar";
import { OpenToolbar } from "~/app/@common/transaction/ui/transaction-status/OpenToolbar";
import { ResolvedToolbar } from "~/app/@common/transaction/ui/transaction-status/ResolvedToolbar";

export namespace TransactionToolbar {
	export interface Props extends Container.Props {
		transaction: tTransaction;
	}
}

export const TransactionToolbar: FC<TransactionToolbar.Props> = ({ transaction, ui, ...props }) => {
	const toolbar = match(transaction.status)
		.with("open", () => {
			return <OpenToolbar transaction={transaction} />;
		})
		.with("resolved", () => {
			return <ResolvedToolbar transaction={transaction} />;
		})
		.with("dispute", () => {
			return <DisputeToolbar transaction={transaction} />;
		})
		.with("pending", "rejected", "expired", "success", "closed", () => {
			return null;
		})
		.exhaustive();

	return toolbar ? (
		<Container
			ui={{
				flow: "vertical",
				opacity: "low",
				justify: "center",
				items: "center",
				gap: "default",
				width: "full",
				...ui,
			}}
			className={[
				"py-1",
			]}
			{...props}
		>
			{toolbar}
		</Container>
	) : null;
};
