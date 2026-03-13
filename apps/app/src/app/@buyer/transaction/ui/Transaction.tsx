import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import { tUserSideEnum } from "@zbav-se.me/sdk/api/public";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/buyer/transaction";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useRef, useState } from "react";
import { useUpload } from "~/app/@common/gallery/hook/useUpload";
import { ListingPrice } from "~/app/@common/listing/ui/ListingPrice";
import { LocationBadge } from "~/app/@common/location/ui/LocationBadge";
import { TransactionChat, TransactionMenuButton } from "~/app/@common/transaction/ui";
import { TransactionEntryList } from "~/app/@common/transaction-entry/ui/TransactionEntryList";
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
	const { data: transaction } = withTransactionQuery.useFetchQuery(transactionId, {
		refetchInterval: refresh,
	});
	const [, setDetail] = useState(false);
	const hero = useUpload(transaction.gallery.items);

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
						side={tUserSideEnum.buyer}
						containerRef={containerRef}
						transactionId={transaction.id}
						refresh={refresh}
						ui={{
							inner: "default",
						}}
					/>
				</Container>

				<TransactionChat
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
					resolved={"chat"}
					text={{
						open: translator.text("Transaction - send a message (placeholder)"),
						dispute: translator.text(
							"Transaction - dispute - send a message (placeholder)",
						),
						pending: translator.text("Transaction not accepted - buyer (message)"),
						resolved: translator.text(
							"Transaction - resolved -send a message (placeholder)",
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
