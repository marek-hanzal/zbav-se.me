import { Container } from "@use-pico/client/ui/container";
import { withTransactionFetchQuery } from "@zbav-se.me/sdk/query/user/transaction";
import type { FC } from "react";
import { useRef, useState } from "react";
import { useHeroUpload } from "~/app/gallery/hook/useHeroUpload";
import { MessageList } from "~/app/message/MessageList";
import { TransactionChat } from "~/app/transaction/ui/TransactionChat";
import { TransactionMessage } from "~/app/transaction/ui/TransactionMessage";
import { TransactionToolbar } from "~/app/transaction/ui/TransactionToolbar";

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
					// biome-ignore lint/correctness/useHookAtTopLevel: Ssst
					const [detail, setDetail] = useState(false);
					// biome-ignore lint/correctness/useHookAtTopLevel: Ssst 2.0
					const hero = useHeroUpload(transaction.gallery.items);

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
