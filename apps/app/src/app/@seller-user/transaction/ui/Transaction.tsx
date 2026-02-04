import { Container } from "@use-pico/client/ui/container";
import { withTransactionFetchQuery } from "@zbav-se.me/sdk/query/seller-user/transaction";
import type { FC } from "react";
import { useRef } from "react";
import { MessageList } from "~/app/@common/message/MessageList";
import { TransactionMessage } from "~/app/@seller-session/transaction/ui/TransactionMessage";
import { TransactionChat } from "~/app/@seller-user/transaction/ui/TransactionChat";
import { TransactionToolbar } from "~/app/@seller-user/transaction/ui/TransactionToolbar";

export namespace Transaction {
	export interface Props extends Container.Props {
		transactionId: string;
		refresh: number;
	}
}

export const Transaction: FC<Transaction.Props> = ({ transactionId, refresh, ...props }) => {
	const containerRef = useRef<HTMLDivElement>(null);

	return (
		<Container
			ui={{
				height: "full",
			}}
			{...props}
		>
			<withTransactionFetchQuery.Suspense
				data={{
					where: {
						id: transactionId,
					},
				}}
				options={{
					refetchInterval: refresh,
				}}
				fallback={null}
			>
				{({ data: transaction }) => {
					return (
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
								<MessageList
									containerRef={containerRef}
									messageThreadId={transaction.messageThreadId}
									refresh={refresh}
								>
									<TransactionMessage transaction={transaction} />

									<TransactionToolbar transaction={transaction} />
								</MessageList>
							</Container>

							<TransactionChat transaction={transaction} />
						</Container>
					);
				}}
			</withTransactionFetchQuery.Suspense>
		</Container>
	);
};
