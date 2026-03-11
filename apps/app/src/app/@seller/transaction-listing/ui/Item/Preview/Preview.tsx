import type { MarkSuspense } from "@use-pico/client/type";
import { Typo } from "@use-pico/client/ui/typo";
import { translator } from "@use-pico/common/translator";
import type { tTransactionEntryQuery } from "@zbav-se.me/sdk/api/user";
import { withTransactionEntryQuery } from "@zbav-se.me/sdk/query/user/transaction-entry";
import type { FC } from "react";
import { Label } from "./Label";

export namespace Preview {
	export interface Props extends MarkSuspense.Props {
		transactionId: string;
	}
}

export const Preview: FC<Preview.Props> = ({ _suspense, transactionId }) => {
	const query: tTransactionEntryQuery = {
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
	};
	const { data } = withTransactionEntryQuery.useCollectionQuery(query);
	const [transactionEntryId] = data;

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

	return (
		<Label
			_suspense={_suspense}
			transactionEntryId={transactionEntryId}
		/>
	);
};
