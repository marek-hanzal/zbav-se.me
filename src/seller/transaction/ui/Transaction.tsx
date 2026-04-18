import { useQueryClient } from "@tanstack/react-query";
import { type FC, useRef } from "react";
import { match } from "ts-pattern";
import { Container } from "@/lib/client/container";
import type { MarkSuspense } from "@/lib/client/type";
import { translator } from "@/lib/common/translator";
import { useUpload } from "~/common/gallery/hook/useUpload";
import { ListingPrice } from "~/common/listing/ui/ListingPrice";
import { HeroImage } from "~/common/ui/img";
import { AckMessage } from "~/seller/transaction/ui/status/AckMessage";
import { TransactionChat } from "~/user/transaction/ui/TransactionChat";
import { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";
import { TransactionEntryList } from "~/user/transaction-entry/ui/TransactionEntryList";
import { withTransactionQuery } from "../query/withTransactionQuery";
import { archiveBuyerMessageActivity } from "../service/archiveBuyerMessageActivity";
import { InterestMessage } from "./status/InterestMessage";
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
				data-ui-layout="vertical-header-content"
				data-ui-height="full"
				data-ui-scroll="vertical"
			>
				<Container
					data-ui="Transaction-[HeroContainer]"
					data-ui-position="relative"
					data-ui-height="content"
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

			{match(transaction.status)
				.with("interest", () => {
					return (
						<Container
							ui={{
								flow: "vertical",
								inner: "default",
								gap: "default",
							}}
						>
							<InterestMessage
								close={() => {}}
								transaction={transaction}
							/>
						</Container>
					);
				})
				.with("success", "closed", "rejected", () => {
					return (
						<Container
							ui={{
								flow: "vertical",
								inner: "default",
								gap: "default",
							}}
						>
							<AckMessage
								close={close}
								transaction={transaction}
							/>
						</Container>
					);
				})
				.otherwise(() => {
					return (
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
								pending: translator.text(
									"Transaction not accepted - seller (message)",
								),
								resolved: translator.text(
									"Chat - transaction resolved - seller cannot write (message)",
								),
								closed: translator.text("Chat - transaction closed (message)"),
							}}
							ui={{
								inner: "default",
							}}
						/>
					);
				})}
		</Container>
	);
};
