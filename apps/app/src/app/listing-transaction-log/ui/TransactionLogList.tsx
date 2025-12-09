import { keepPreviousData } from "@tanstack/react-query";
import type { MarkSuspense } from "@use-pico/client/type";
import { Badge } from "@use-pico/client/ui/badge";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import type {
	tGalleryItem,
	tListingTransaction,
	tListingTransactionLogQuery,
	tListingTransactionStatusEnum,
	tUserSideEnum,
} from "@zbav-se.me/sdk/api/user";
import {
	withListingFetchQuery,
	withListingTransactionLogCollectionQuery,
} from "@zbav-se.me/sdk/query/user";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useId, useLayoutEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { ListingDetailContainer } from "~/app/listing/ui/ListingDetailContainer";
import { ListingLocation } from "~/app/listing/ui/ListingLocation";
import { ListingPrice } from "~/app/listing/ui/ListingPrice";
import { TransactionChat } from "./TransactionChat";
import { TransactionLogItem } from "./TransactionLogItem";

export namespace TransactionLogList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		locale: string;
		side: tUserSideEnum;
		query: tListingTransactionLogQuery;
		listingTransaction: tListingTransaction;
		noHero?: boolean;
	}
}

export const TransactionLogList: FC<TransactionLogList.Props> = ({
	_suspense,
	locale,
	side,
	query,
	listingTransaction,
	noHero = false,
	ui,
	...props
}) => {
	const [hero] = listingTransaction.gallery.items as [
		tGalleryItem,
		...tGalleryItem[],
	];
	const detailSheetId = useId();
	const [detail, setDetail] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	const listingTransactionLogCollectionQuery =
		withListingTransactionLogCollectionQuery.useSuspenseQuery(
			{
				...query,
				cursor: {
					page: 0,
					/**
					 * Maximum of 256 events should be enough
					 */
					size: 256,
				},
			},
			{
				refetchInterval: 5_000,
				placeholderData: keepPreviousData,
			},
		);

	const data = listingTransactionLogCollectionQuery.data;

	const lastLog = data.data[data.data.length - 1];
	const lastStatusLog = data.data.findLast((item) => item.event === "status");

	const scrollToBottom = useDebouncedCallback(
		(behavior: ScrollBehavior) => {
			containerRef.current?.scrollTo({
				top: containerRef.current?.scrollHeight,
				behavior,
			});
		},
		150,
		{
			leading: true,
		},
	);

	useLayoutEffect(() => {
		if (!contentRef.current || !containerRef.current) {
			return;
		}

		scrollToBottom("instant");

		const ro = new ResizeObserver(() => {
			scrollToBottom("smooth");
		});

		ro.observe(contentRef.current);

		return () => {
			ro.disconnect();
		};
	}, [
		scrollToBottom,
	]);

	/**
	 * If there is no last status, it's a logical bug, so we just won't render.
	 */
	if (!lastLog || !lastStatusLog) {
		return null;
	}

	const isClosed = (
		[
			"closed",
			"expired",
			"closed",
			"rejected",
		] satisfies tListingTransactionStatusEnum[] as tListingTransactionStatusEnum[]
	).includes(lastStatusLog.status);

	return (
		<Container
			data-ui={"TransactionLogList-root"}
			ui={{
				layout: isClosed ? undefined : "vertical-content-footer",
				height: "full",
				gap: "default",
				...ui,
			}}
			{...props}
		>
			<Container
				ref={containerRef}
				data-ui={"TransactionLogList-list"}
				ui={{
					scroll: "vertical",
					height: "full",
				}}
			>
				<Container
					ref={contentRef}
					ui={{
						layout: "vertical-flex",
						height: "content",
						gap: "default",
					}}
				>
					{noHero ? null : (
						<Badge
							className="flex flex-col items-start gap-1 w-full h-64 p-0 rounded-md relative border-none"
							ui={{
								tone: "secondary",
							}}
						>
							<HeroImage
								data-ui={"ListingHero-image"}
								src={hero.upload.url}
								alt={`Hero image for listing transaction ${listingTransaction.id}`}
								visible
								onClick={() => setDetail((prev) => !prev)}
							/>

							<ListingPrice
								price={listingTransaction.price}
								locale={locale}
								currency={listingTransaction.currency}
							/>

							<ListingLocation location={listingTransaction.location} />

							<BottomSheet
								id={detailSheetId}
								isOpen={detail}
								onClose={() => setDetail(false)}
								detent={"full"}
								header={{
									close: true,
									title: listingTransaction.title,
								}}
							>
								<withListingFetchQuery.Suspense
									data={{
										where: {
											id: listingTransaction.listingId,
										},
									}}
									fallback={<SpinnerContainer />}
								>
									{({ data }) => {
										return (
											<ListingDetailContainer
												locale={locale}
												feedId={undefined}
												listing={data}
												withScore={false}
												parentSheetId={detailSheetId}
												tools={[]}
											/>
										);
									}}
								</withListingFetchQuery.Suspense>
							</BottomSheet>
						</Badge>
					)}

					<Container
						ui={{
							layout: "vertical-flex",
							gap: "default",
						}}
					>
						{data.data.map((log) => {
							const isCurrent = lastLog.id === log.id;

							return (
								<TransactionLogItem
									key={log.id}
									locale={locale}
									side={side}
									listingTransactionLog={log}
									isCurrent={isCurrent}
									isClosed={isClosed}
								/>
							);
						})}
					</Container>
				</Container>
			</Container>

			{isClosed ? null : (
				<TransactionChat
					locale={locale}
					side={side}
					listingTransactionLog={lastLog}
				/>
			)}
		</Container>
	);
};
