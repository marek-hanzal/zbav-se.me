import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { tUserSideEnum } from "@zbav-se.me/sdk/api/public";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/seller/transaction";
import { type FC, useRef } from "react";
import { TransactionEntryListSuspense } from "~/app/v0/@common/transaction-entry/TransactionEntryListSuspense";
import { TransactionChat } from "./TransactionChat";
import { TransactionMessage } from "./TransactionMessage";
import { TransactionToolbar } from "./TransactionToolbar";

export namespace Transaction {
	export interface Props extends Container.Props, MarkSuspense.Props {
		transactionId: string;
		refresh: number;
	}
}

export const Transaction: FC<Transaction.Props> = ({
	_suspense,
	transactionId,
	refresh,
	...props
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const { data: transaction } = withTransactionQuery.useFetchQuery(transactionId, {
		refetchInterval: refresh,
	});

	return (
		<Container
			ui={{
				height: "full",
			}}
			{...props}
		>
			<Container
				data-ui={"TransactionSheet-[Container]"}
				ui={{
					layout: "vertical-content-footer",
					height: "full",
					gap: "xs",
					inner: "default",
				}}
			>
				<Container
					data-ui="Transaction-[MessageListContainer]"
					ref={containerRef}
					ui={{
						layout: "vertical",
						height: "full",
						scroll: "vertical",
					}}
				>
					<TransactionEntryListSuspense
						side={tUserSideEnum.seller}
						containerRef={containerRef}
						transactionId={transaction.id}
						refresh={refresh}
					>
						<TransactionMessage transaction={transaction} />
						<TransactionToolbar transaction={transaction} />
					</TransactionEntryListSuspense>
				</Container>

				<TransactionChat transaction={transaction} />
			</Container>
		</Container>
	);
};
