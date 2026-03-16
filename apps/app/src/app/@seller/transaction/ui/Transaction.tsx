import { useQueryClient } from "@tanstack/react-query";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import { tUserSideEnum } from "@zbav-se.me/sdk/api/public";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/seller/transaction";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useEffect, useRef } from "react";
import { useUpload } from "~/app/@common/gallery/hook/useUpload";
import { ListingPrice } from "~/app/@common/listing/ui/ListingPrice";
import { TransactionChat } from "~/app/@common/transaction/ui/TransactionChat";
import { TransactionMenuButton } from "~/app/@common/transaction/ui/TransactionMenuButton";
import { TransactionEntryList } from "~/app/@common/transaction-entry/ui/TransactionEntryList";
import { archiveBuyerMessageInbox } from "../service/archiveBuyerMessageInbox";
import { withArchiveBuyerMessageInboxMutation } from "../service/withArchiveBuyerMessageInboxMutation";
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
	...props
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const queryClient = useQueryClient();
	const { data: transaction } = withTransactionQuery.useFetchQuery(transactionId, {
		refetchInterval: refresh,
	});
	const hero = useUpload(transaction.gallery.items);
	const archiveMutation = withArchiveBuyerMessageInboxMutation.useMutation();

	// biome-ignore lint/correctness/useExhaustiveDependencies: We're OK
	useEffect(() => {
		archiveMutation.mutate({
			transactionId: transaction.id,
			listingId: transaction.listingId,
			status: transaction.status,
		});
	}, [
		transaction,
	]);

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
				}}
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
						side={tUserSideEnum.seller}
						containerRef={containerRef}
						transactionId={transaction.id}
						refresh={refresh}
						ui={{
							inner: "default",
						}}
					/>
				</Container>

				<TransactionChat
					hooks={{
						async onPostMutation() {
							try {
								await archiveBuyerMessageInbox({
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
					mode={"readonly"}
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
			</Container>
		</Container>
	);
};
