import { keepPreviousData } from "@tanstack/react-query";
import type { MarkSuspense } from "@use-pico/client/type";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import type {
	tGalleryItem,
	tTransaction,
	tTransactionLogQuery,
	tTransactionStatusEnum,
	tUserSideEnum,
} from "@zbav-se.me/sdk/api/user";
import {
	withListingFetchQuery,
	withTransactionLogCollectionQuery,
} from "@zbav-se.me/sdk/query/user";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useId, useLayoutEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { ListingDetail } from "~/app/listing/ui/ListingDetail";
import { ListingOverlay } from "~/app/listing/ui/overlay/ListingOverlay";
import { TransactionChat } from "./TransactionChat";
import { TransactionLogItem } from "./TransactionLogItem";

export namespace TransactionLogList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		locale: string;
		side: tUserSideEnum;
		query: tTransactionLogQuery;
		transaction: tTransaction;
		noHero?: boolean;
	}
}

export const TransactionLogList: FC<TransactionLogList.Props> = ({
	_suspense,
	locale,
	side,
	query,
	transaction,
	noHero = false,
	ui,
	...props
}) => {
	const [hero] = transaction.gallery.items as [
		tGalleryItem,
		...tGalleryItem[],
	];
	const detailSheetId = useId();
	const [detail, setDetail] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	const transactionLogCollectionQuery = withTransactionLogCollectionQuery.useSuspenseQuery(
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

	const data = transactionLogCollectionQuery.data;

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
		] satisfies tTransactionStatusEnum[] as tTransactionStatusEnum[]
	).includes(lastStatusLog.status);

	return (
		<Container
			data-ui={"TransactionLogList[Container]"}
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
				data-ui={"TransactionLogList-[Container.scroll]"}
				ui={{
					scroll: "vertical",
					height: "full",
				}}
			>
				<Container
					data-ui={"TransactionLogList-[Container.content]"}
					ref={contentRef}
					ui={{
						layout: "vertical-flex",
						height: "content",
						gap: "default",
					}}
				>
					{noHero ? null : (
						<Container
							data-ui={"TransactionLogList-[Container.hero]"}
							className={[
								"h-64",
							]}
							ui={{
								layout: "vertical-flex",
								tone: "secondary",
								position: "relative",
							}}
						>
							<ListingOverlay
								data-ui={"TransactionLogList-[ListingOverlay]"}
								locale={locale}
								listing={transaction}
							/>

							<HeroImage
								data-ui={"ListingHero-image"}
								src={hero.upload.url}
								alt={`Hero image for listing transaction ${transaction.id}`}
								visible
								onClick={() => setDetail((prev) => !prev)}
							/>

							<BottomSheet
								id={detailSheetId}
								isOpen={detail}
								onClose={() => setDetail(false)}
								detent={"full"}
								header={{
									close: true,
									title: transaction.title,
								}}
							>
								<withListingFetchQuery.Suspense
									data={{
										where: {
											id: transaction.listingId,
										},
									}}
									fallback={<SpinnerContainer />}
								>
									{({ data }) => {
										return (
											<ListingDetail
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
						</Container>
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
									transactionLog={log}
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
					transactionLog={lastLog}
				/>
			)}
		</Container>
	);
};
