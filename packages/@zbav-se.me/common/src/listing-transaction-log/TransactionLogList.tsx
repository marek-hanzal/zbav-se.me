import { keepPreviousData } from "@tanstack/react-query";
import type { MarkSuspense } from "@use-pico/client/type";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import { tvc } from "@use-pico/cls";
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
import { ListingDetailContainer } from "../listing/ListingDetailContainer";
import { TransactionChat } from "./TransactionChat";
import { TransactionLogItem } from "./TransactionLogItem";

export namespace TransactionLogList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		locale: string;
		side: tUserSideEnum;
		query: tListingTransactionLogQuery;
		listingTransaction: tListingTransaction;
	}
}

export const TransactionLogList: FC<TransactionLogList.Props> = ({
	_suspense,
	locale,
	side,
	query,
	listingTransaction,
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
			ui={"TransactionLogList-root"}
			layout={isClosed ? undefined : "vertical-content-footer"}
			gap={"md"}
			{...props}
		>
			<Container
				ref={containerRef}
				ui={"TransactionLogList-list"}
				scroll={"vertical"}
				height={"fit"}
			>
				<Container
					ref={contentRef}
					layout={"vertical-flex"}
					gap={"md"}
					height={"content"}
				>
					<div
						className={tvc([
							"flex",
							"flex-col",
							"gap-1",
						])}
					>
						<div
							className={tvc([
								"w-full",
								"h-32",
							])}
						>
							<HeroImage
								ui={"ListingHero-image"}
								src={hero.upload.url}
								alt={`Hero image for listing transaction ${listingTransaction.id}`}
								visible
								round
								onClick={() => setDetail((prev) => !prev)}
							/>

							<BottomSheet
								id={detailSheetId}
								isOpen={detail}
								onClose={() => setDetail(false)}
								detent={"full"}
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
												parentSheetId={detailSheetId}
												locale={locale}
												listing={data}
												withScore
												square={"md"}
											/>
										);
									}}
								</withListingFetchQuery.Suspense>
							</BottomSheet>
						</div>

						<Typo
							label={listingTransaction.title}
							wrap={"wrap"}
						/>
					</div>

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

			{isClosed ? null : (
				<TransactionChat
					locale={locale}
					side="buyer"
					listingTransaction={listingTransaction}
					listingTransactionLog={lastLog}
				/>
			)}
		</Container>
	);
};
