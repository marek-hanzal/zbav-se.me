import { Typo } from "@use-pico/client/ui/typo";
import { translator } from "@use-pico/common/translator";
import { withTransactionEntryQuery } from "@zbav-se.me/sdk/query/user/transaction-entry";
import type { FC } from "react";
import { PreviewData } from "./PreviewData";

export namespace Preview {
	export interface Props {
		transactionId: string;
	}
}

export const Preview: FC<Preview.Props> = ({ transactionId }) => {
	const { data } = withTransactionEntryQuery.useCollectionQuery({
		cursor: {
			page: 0,
			size: 1,
		},
		filter: {
			transactionId,
		},
		sort: [
			{
				field: "createdAt",
				order: "desc",
			},
		],
	});
	const transactionEntryId = data[0];

	if (!transactionEntryId) {
		return (
			<Typo
				data-ui="TransactionItemPreview[Fallback]"
				label={translator.text("Transaction row - no activity (label)")}
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
	}

	return <PreviewData transactionEntryId={transactionEntryId} />;
};
