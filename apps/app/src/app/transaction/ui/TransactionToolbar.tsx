import { Container } from "@use-pico/client/ui/container";
import type { tTransaction } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";
import { OpenToolbar } from "~/app/transaction/ui/transaction-status/OpenToolbar";
import { ResolvedToolbar } from "~/app/transaction/ui/transaction-status/ResolvedToolbar";

export namespace TransactionToolbar {
	export interface Props extends Container.Props {
		transaction: tTransaction;
	}
}

export const TransactionToolbar: FC<TransactionToolbar.Props> = ({ transaction, ui, ...props }) => {
	return (
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
			{match(transaction.status)
				.with("open", () => {
					return <OpenToolbar transaction={transaction} />;
				})
				.with("resolved", () => {
					return <ResolvedToolbar transaction={transaction} />;
				})
				.with("pending", "rejected", "expired", "success", () => {
					return null;
				})
				.exhaustive()}
		</Container>
	);
};
