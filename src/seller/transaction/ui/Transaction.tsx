import { useQueryClient } from "@tanstack/react-query";
import { type FC, useRef } from "react";
import { Container } from "@/lib/client/container";
import type { MarkSuspense } from "@/lib/client/type";
import { translator } from "@/lib/common/translator";
import { useUpload } from "~/common/gallery/hook/useUpload";
import { ListingPrice } from "~/common/listing/ui/ListingPrice";
import { HeroImage } from "~/common/ui/img";
import { TransactionChat } from "~/user/transaction/ui/TransactionChat";
import { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";
import { TransactionEntryList } from "~/user/transaction-entry/ui/TransactionEntryList";
import { withTransactionQuery } from "../query/withTransactionQuery";
import { archiveBuyerMessageActivity } from "../service/archiveBuyerMessageActivity";
import { PendingMessage } from "./status/PendingMessage";
import { TransactionMenu } from "./TransactionMenu";

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
	ui,
	...props
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const queryClient = useQueryClient();
	const { data: transaction } = withTransactionQuery.useFetchQuery(transactionId, {
		refetchInterval: refresh,
	});
	const hero = useUpload(transaction.gallery.items);

	return (
		<Container
			data-ui={"Transaction"}
			ui={{
				layout: "vertical-content-footer",
				height: "full",
				gap: "xs",
				...ui,
			}}
			{...props}
		>
			<Container
				data-ui="Transaction-[MessageListContainer]"
				ref={containerRef}
				ui={{
					layout: "vertical-header-content",
					height: "full",
					scroll: "vertical",
				}}
			>
				<Container
					data-ui="Transaction-[HeroContainer]"
					ui={{
						position: "relative",
						height: "content",
					}}
				>
					<HeroImage
						src={hero.url}
						alt={`Hero image for transaction ${transaction.id}`}
						className={"h-42"}
					/>

					<ListingPrice
						data-ui={"ListingOverlay-[ListingPrice]"}
						price={transaction.price}
						priceType={transaction.priceType}
						currency={transaction.currency}
						ui={{
							snapTo: "top-center",
							opacity: "8",
							zIndex: true,
						}}
					/>
				</Container>

				<TransactionEntryList
					_suspense={"I know"}
					side={"seller"}
					containerRef={containerRef}
					transactionId={transaction.id}
					refresh={refresh}
					ui={{
						inner: "default",
					}}
				/>
			</Container>

			{transaction.status === "pending" ? (
				<Container
					ui={{
						flow: "vertical",
						inner: "default",
						gap: "default",
					}}
				>
					<PendingMessage
						close={() => {}}
						transaction={transaction}
					/>
				</Container>
			) : (
				<TransactionChat
					hooks={{
						async onPostMutation() {
							try {
								await archiveBuyerMessageActivity({
									queryClient,
									transactionId: transaction.id,
									listingId: transaction.listingId,
								});
							} catch {
								// Keep message send flow usable even if unread archival fails.
							}
						},
					}}
					transaction={transaction}
					left={
						<TransactionMenuButton>
							{(close) => (
								<TransactionMenu
									close={close}
									transaction={transaction}
								/>
							)}
						</TransactionMenuButton>
					}
					text={{
						open: translator.text("Transaction - send a message (placeholder)"),
						dispute: translator.text(
							"Transaction - dispute - send a message (placeholder)",
						),
						pending: translator.text("Transaction not accepted - seller (message)"),
						resolved: translator.text(
							"Chat - transaction resolved - seller cannot write (message)",
						),
						closed: translator.text("Chat - transaction closed (message)"),
					}}
					ui={{
						inner: "default",
					}}
				/>
			)}
		</Container>
	);
};
