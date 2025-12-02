import { keepPreviousData } from "@tanstack/react-query";
import type { MarkSuspense } from "@use-pico/client/type";
import { Badge } from "@use-pico/client/ui/badge";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { PriceInline } from "@use-pico/client/ui/price-inline";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
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
			height={"fit"}
			tone={"unset"}
			theme={"unset"}
			{...props}
		>
			<Container
				ref={containerRef}
				ui={"TransactionLogList-list"}
				scroll={"vertical"}
				height={"fit"}
				tone={"unset"}
				theme={"unset"}
			>
				<Container
					ref={contentRef}
					layout={"vertical-flex"}
					gap={"md"}
					height={"content"}
					tone={"unset"}
					theme={"unset"}
				>
					{noHero ? null : (
						<Badge
							tone={"secondary"}
							className={[
								"flex",
								"flex-col",
								"items-start",
								"gap-1",
								"w-full",
								"h-64",
								"p-0",
								"rounded-md",
								"relative",
								"border-none",
							]}
						>
							<HeroImage
								ui={"ListingHero-image"}
								src={hero.upload.url}
								alt={`Hero image for listing transaction ${listingTransaction.id}`}
								visible
								onClick={() => setDetail((prev) => !prev)}
							/>

							<Badge
								ui={"TransactionLogList-price"}
								tone={"secondary"}
								theme={"light"}
								round={"default"}
								snapTo={"top-center"}
								tweak={{
									slot: {
										root: {
											class: [
												"max-w-1/2",
											],
										},
									},
								}}
							>
								{listingTransaction.price > 0 ? (
									<PriceInline
										price={listingTransaction.price}
										locale={locale}
										currency={listingTransaction.currency}
									/>
								) : (
									<Tx label={"Price - free"} />
								)}
							</Badge>

							<Badge
								ui={"TransactionLogList-bottom"}
								size={"lg"}
								round={"default"}
								snapTo={"bottom"}
								tweak={{
									slot: {
										root: {
											class: [
												"opacity-85",
												"h-fit",
											],
										},
									},
								}}
							>
								<Typo
									truncate
									label={listingTransaction.location}
								/>
							</Badge>

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
												parentSheetId={detailSheetId}
												locale={locale}
												listing={data}
												withScore
											/>
										);
									}}
								</withListingFetchQuery.Suspense>
							</BottomSheet>
						</Badge>
					)}

					<Container
						layout={"vertical-flex"}
						height={"content"}
						gap={"md"}
						square={"md"}
						tone={"unset"}
						theme={"unset"}
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
					square={"md"}
				/>
			)}
		</Container>
	);
};
