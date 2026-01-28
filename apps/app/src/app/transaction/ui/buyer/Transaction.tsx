import { VisibilityContext } from "@use-pico/client/context";
import { createNoopVisibilityStore } from "@use-pico/client/store";
import { Container } from "@use-pico/client/ui/container";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/buyer-session/listing";
import { withTransactionFetchQuery } from "@zbav-se.me/sdk/query/buyer-user/transaction";
import { HeroImage } from "@zbav-se.me/ui/img";
import type { FC } from "react";
import { useRef, useState } from "react";
import { useHeroUpload } from "~/app/gallery/hook/useHeroUpload";
import { ListingSheet } from "~/app/listing/ui/ListingSheet";
import { ListingOverlay } from "~/app/listing/ui/overlay/ListingOverlay";
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

								<MessageList
									containerRef={containerRef}
									messageThreadId={transaction.messageThreadId}
									refresh={refresh}
								>
									<TransactionMessage transaction={transaction} />

									<TransactionToolbar transaction={transaction} />
								</MessageList>

								<withListingFetchQuery.Suspense
									data={{
										where: {
											id: transaction.listingId,
										},
									}}
									fallback={null}
								>
									{({ data: listing }) => {
										return (
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
										);
									}}
								</withListingFetchQuery.Suspense>
							</Container>

							<TransactionChat transaction={transaction} />
						</Container>
					);
				}}
			</withTransactionFetchQuery.Suspense>
		</Container>
	);
};
