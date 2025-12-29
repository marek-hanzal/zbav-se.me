import { VisibilityContext } from "@use-pico/client/context";
import { createNoopVisibilityStore } from "@use-pico/client/store";
import type { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container } from "@use-pico/client/ui/container";
import { SheetView } from "@use-pico/client/ui/sheet-view";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/user/listing";
import { withTransactionFetchQuery } from "@zbav-se.me/sdk/query/user/transaction";
import { CloseButton } from "@zbav-se.me/ui/button";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useRef, useState } from "react";
import { useHeroUpload } from "~/app/gallery/hook/useHeroUpload";
import { ListingSheet } from "~/app/listing/ui/ListingSheet";
import { ListingOverlay } from "~/app/listing/ui/overlay/ListingOverlay";
import { MessageList } from "~/app/message/MessageList";
import { TransactionChat } from "~/app/transaction/ui/TransactionChat";
import { TransactionMessage } from "~/app/transaction/ui/TransactionMessage";
import { TransactionToolbar } from "~/app/transaction/ui/TransactionToolbar";

export namespace TransactionSheet {
	export type View = "detail";

	export interface Props extends BottomSheet.Props {
		transactionId: string;
	}
}

export const TransactionSheet: FC<TransactionSheet.Props> = ({ transactionId, ...props }) => {
	const [view, setView] = useState<TransactionSheet.View>("detail");
	const containerRef = useRef<HTMLDivElement>(null);

	return (
		<withTransactionFetchQuery.Suspense
			data={{
				where: {
					id: transactionId,
				},
			}}
			options={{
				refetchInterval: 1_500,
			}}
			fallback={null}
		>
			{({ data: transaction }) => {
				// biome-ignore lint/correctness/useHookAtTopLevel: Ssst
				const [detail, setDetail] = useState(false);
				// biome-ignore lint/correctness/useHookAtTopLevel: Ssst 2.0
				const hero = useHeroUpload(transaction.gallery.items);

				return (
					<SheetView
						data-ui={"TransactionSheet-[SheetView]"}
						data-id={transactionId}
						state={{
							value: view,
							set: setView,
						}}
						contentProps={{
							disableScroll: true,
						}}
						views={{
							detail: {
								children: (
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
											ref={containerRef}
											ui={{
												layout: "vertical-header-content",
												scroll: "vertical",
											}}
											className={"h-full"}
										>
											<Container
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
														<VisibilityContext
															value={createNoopVisibilityStore()}
														>
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
								),
								header: ({ close }) => ({
									title: transaction.title,
									right: <CloseButton onClick={close} />,
								}),
							},
						}}
						detent={"full"}
						{...props}
					/>
				);
			}}
		</withTransactionFetchQuery.Suspense>
	);
};
