import { useQueryClient } from "@tanstack/react-query";
import { type FC, useRef, useState } from "react";
import { match } from "ts-pattern";
import { Container } from "@/lib/client/container";
import type { MarkSuspense } from "@/lib/client/type";
import { translator } from "@/lib/common/translator";
import { RejectedMessage } from "~/buyer/transaction/ui/status/RejectedMessage";
import { useUpload } from "~/common/gallery/hook/useUpload";
import { ListingPrice } from "~/common/listing/ui/ListingPrice";
import { LocationBadge } from "~/common/location/ui/LocationBadge";
import { HeroImage } from "~/common/ui/img";
import { UserSideEnumSchema } from "~/common/user-event/enum/UserSideEnumSchema";
import { TransactionChat } from "~/user/transaction/ui/TransactionChat";
import { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";
import { TransactionEntryList } from "~/user/transaction-entry/ui/TransactionEntryList";
import { withTransactionQuery } from "../query/withTransactionQuery";
import { archiveSellerMessageActivity } from "../service/archiveSellerMessageActivity";
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
	const [, setDetail] = useState(false);
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
				ref={containerRef}
				ui={{
					layout: "vertical-header-content",
					height: "full",
					scroll: "vertical",
				}}
			>
				<Container
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
				.with("rejected", () => {
					return (
						<Container
							ui={{
								flow: "vertical",
								inner: "default",
								gap: "default",
							}}
						>
							<RejectedMessage
								close={() => {}}
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
										await archiveSellerMessageActivity({
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
								pending: translator.text(
									"Transaction not accepted - buyer (message)",
								),
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
					);
				})}
		</Container>
	);
};
