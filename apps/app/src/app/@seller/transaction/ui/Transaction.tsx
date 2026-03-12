import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { tUserSideEnum } from "@zbav-se.me/sdk/api/public";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/seller/transaction";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useRef } from "react";
import { useUpload } from "~/app/@common/gallery/hook/useUpload";
import { ListingPrice } from "~/app/@common/listing/ui/ListingPrice";
import { TransactionEntryList } from "~/app/@common/transaction-entry/ui/TransactionEntryList";
import { TransactionChat } from "~/app/@seller/transaction/~public/TransactionChat";
import { TransactionToolbar } from "~/app/@seller/transaction/~public/TransactionToolbar";
import { TransactionMessage } from "~/app/v0/@seller/transaction/ui/TransactionMessage";

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
					>
						<TransactionMessage transaction={transaction} />

						<TransactionToolbar transaction={transaction} />
					</TransactionEntryList>
				</Container>

				<TransactionChat
					transaction={transaction}
					ui={{
						inner: "default",
					}}
				/>
			</Container>
		</Container>
	);
};
