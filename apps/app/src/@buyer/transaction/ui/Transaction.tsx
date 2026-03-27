import { useQueryClient } from "@tanstack/react-query";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useEffect, useRef, useState } from "react";
import { useUpload } from "~/@common/gallery/hook/useUpload";
import { ListingPrice } from "~/@common/listing/ui/ListingPrice";
import { LocationBadge } from "~/@common/location/ui/LocationBadge";
import { UserSideEnumSchema } from "~/@common/user-event/enum/UserSideEnumSchema";
import { TransactionChat } from "~/@user/transaction/ui/TransactionChat";
import { TransactionMenuButton } from "~/@user/transaction/ui/TransactionMenuButton";
import { TransactionEntryList } from "~/@user/transaction-entry/ui/TransactionEntryList";
import { withTransactionQuery } from "../query/withTransactionQuery";
import { archiveSellerMessageInbox } from "../service/archiveSellerMessageInbox";
import { withArchiveSellerMessageInboxMutation } from "../service/withArchiveSellerMessageInboxMutation";
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
	...props
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const queryClient = useQueryClient();
	const { data: transaction } = withTransactionQuery.useFetchQuery(transactionId, {
		refetchInterval: refresh,
	});
	const [, setDetail] = useState(false);
	const hero = useUpload(transaction.gallery.items);
	const archiveMutation = withArchiveSellerMessageInboxMutation.useMutation();

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
						data-action={"open transaction detail"}
						ui={{
							position: "relative",
							height: "content",
						}}
						onClick={() => setDetail((prev) => !prev)}
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

						<LocationBadge
							data-ui={"ListingOverlay-[LocationBadge]"}
							location={transaction.location}
							distance={null}
							ui={{
								snapTo: "bottom",
								opacity: "8",
								zIndex: true,
							}}
						/>
					</Container>

					<TransactionEntryList
						_suspense={"I know"}
						side={UserSideEnumSchema.enum.buyer}
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
									await archiveSellerMessageInbox({
										queryClient,
										transactionId: transaction.id,
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
							pending: translator.text("Transaction not accepted - buyer (message)"),
							open: translator.text("Transaction - send a message (placeholder)"),
							dispute: translator.text(
								"Transaction - dispute - send a message (placeholder)",
							),
							resolved: translator.text(
								"Transaction - resolved -send a message (placeholder)",
							),
							closed: translator.text("Chat - transaction closed (message)"),
						}}
						ui={{
							inner: "default",
						}}
					/>
				)}
			</Container>
		</Container>
	);
};
