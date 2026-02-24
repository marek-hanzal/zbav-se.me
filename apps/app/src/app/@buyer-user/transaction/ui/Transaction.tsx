import { VisibilityContext } from "@use-pico/client/context";
import { createNoopVisibilityStore } from "@use-pico/client/store";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { tUserSideEnum } from "@zbav-se.me/sdk/api/public";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/buyer-user/listing";
import { withTransactionFetchQuery } from "@zbav-se.me/sdk/query/buyer-user/transaction";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useRef, useState } from "react";
import { ListingOverlay } from "~/app/@buyer-user/listing/ui/ListingOverlay";
import { ListingSheet } from "~/app/@buyer-user/listing/ui/ListingSheet";
import { TransactionChat } from "~/app/@buyer-user/transaction/ui/TransactionChat";
import { TransactionMessage } from "~/app/@buyer-user/transaction/ui/TransactionMessage";
import { TransactionToolbar } from "~/app/@buyer-user/transaction/ui/TransactionToolbar";
import { useHeroUpload } from "~/app/@common/gallery/hook/useHeroUpload";
import { MessageListSuspense } from "~/app/@common/message/MessageListSuspense";

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
	const { data: transaction } = withTransactionFetchQuery.useSuspenseQuery(
		{
			where: {
				id: transactionId,
			},
		},
		{
			refetchInterval: refresh,
		},
	);
	const { data: listing } = withListingFetchQuery.useSuspenseQuery({
		where: {
			id: transaction.listingId,
		},
	});
	const [detail, setDetail] = useState(false);
	const hero = useHeroUpload(transaction.gallery.items);

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

						<ListingOverlay
							listing={{
								...transaction,
								distance: null,
							}}
						/>
					</Container>

					<MessageListSuspense
						side={tUserSideEnum.buyer}
						containerRef={containerRef}
						messageThreadId={transaction.messageThreadId}
						refresh={refresh}
					>
						<TransactionMessage transaction={transaction} />
						<TransactionToolbar transaction={transaction} />
					</MessageListSuspense>

					<VisibilityContext value={createNoopVisibilityStore()}>
						<ListingSheet
							listing={listing}
							state={{
								value: detail,
								set: setDetail,
							}}
							withScore={false}
							feedId={undefined}
							tools={[]}
						/>
					</VisibilityContext>
				</Container>

				<TransactionChat transaction={transaction} />
			</Container>
		</Container>
	);
};
