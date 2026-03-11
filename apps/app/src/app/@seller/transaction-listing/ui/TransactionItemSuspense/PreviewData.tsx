import { Typo } from "@use-pico/client/ui/typo";
import { withTransactionEntryQuery } from "@zbav-se.me/sdk/query/user/transaction-entry";
import type { FC } from "react";
import { PreviewValue } from "./PreviewValue";

export namespace PreviewData {
	export interface Props {
		transactionEntryId: string;
	}
}

export const PreviewData: FC<PreviewData.Props> = ({ transactionEntryId }) => {
	const { data: transactionEntry } = withTransactionEntryQuery.useFetchQuery(transactionEntryId);

	return (
		<Typo
			data-ui="TransactionItemPreview[Value]"
			label={<PreviewValue transactionEntry={transactionEntry} />}
			ui={{
				text: "sm",
				opacity: "6",
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
