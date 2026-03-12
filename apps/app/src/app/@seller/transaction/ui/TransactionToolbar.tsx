import type { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import type { tTransaction } from "@zbav-se.me/sdk/api/seller";
import type { FC } from "react";
import { match } from "ts-pattern";
import type { TransactionMenuButton } from "~/app/@common/transaction/ui/TransactionMenuButton";
import { DisputeToolbar } from "./status/DisputeToolbar";
import { OpenToolbar } from "./status/OpenToolbar";
import { ResolvedToolbar } from "./status/ResolvedToolbar";

export namespace TransactionToolbar {
	export interface Props extends Container.Props {
		close: TransactionMenuButton.Close;
		transaction: tTransaction;
	}
}

export const TransactionToolbar: FC<TransactionToolbar.Props> = ({
	close,
	transaction,
	ui,
	...props
}) => {
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
		.with("pending", "rejected", "sold", "expired", "success", "closed", () => {
			return null;
		})
		.exhaustive();

	return toolbar ? (
		<Group
			data-ui={"TransactionToolbar[Group]"}
			ui={{
				flow: "vertical",
				opacity: "8",
				justify: "center",
				items: "center",
				width: "full",
				...ui,
			}}
			{...props}
		>
			{toolbar}
		</Group>
	) : null;
};
