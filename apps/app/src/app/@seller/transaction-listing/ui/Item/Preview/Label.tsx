import type { MarkSuspense } from "@use-pico/client/type";
import { Typo } from "@use-pico/client/ui/typo";
import { withTransactionEntryQuery } from "@zbav-se.me/sdk/query/user/transaction-entry";
import type { FC } from "react";
import { toActivityLabel } from "~/app/@seller/transaction/~public/toStatusLabel";

export namespace Label {
	export interface Props extends MarkSuspense.Props {
		isUnread: boolean;
		transactionEntryId: string;
	}
}

export const Label: FC<Label.Props> = ({ _suspense, isUnread, transactionEntryId }) => {
	const { data: transactionEntry } = withTransactionEntryQuery.useFetchQuery(transactionEntryId);
	const label =
		transactionEntry.kind === "text"
			? transactionEntry.payload.text
			: toActivityLabel({
					kind: transactionEntry.kind,
					text: null,
				});

	return (
		<Typo
			data-ui="TransactionItemPreview[Value]"
			label={label}
			ui={{
				text: "sm",
				opacity: isUnread ? undefined : "6",
				font: isUnread ? "bold" : "normal",
			}}
			className={[
				"block",
				"w-full",
				"max-w-full",
				"min-w-0",
				"truncate",
			]}
		/>
	);
};
