import { keepPreviousData } from "@tanstack/react-query";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import type {
	tListingTransaction,
	tListingTransactionLogQuery,
	tListingTransactionStatusEnum,
	tUserSideEnum,
} from "@zbav-se.me/sdk/api/user";
import { withListingTransactionLogCollectionQuery } from "@zbav-se.me/sdk/query/user";
import { type FC, useLayoutEffect, useRef } from "react";
import { TransactionChat } from "./TransactionChat";
import { TransactionLogItem } from "./TransactionLogItem";

export namespace TransactionLogList {
	export interface Props extends Container.Props {
		locale: string;
		side: tUserSideEnum;
		query: tListingTransactionLogQuery;
		listingTransaction: tListingTransaction;
		components: TransactionChat.Components;
	}
}

export const TransactionLogList: FC<TransactionLogList.Props> = ({
	locale,
	side,
	query,
	listingTransaction,
	components,
	...props
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const bottomRef = useRef<HTMLDivElement>(null);

	return (
		<withListingTransactionLogCollectionQuery.Suspense
			data={{
				...query,
				cursor: {
					page: 0,
					/**
					 * Maximum of 256 events should be enough
					 */
					size: 256,
				},
			}}
			fallback={<SpinnerContainer />}
			options={{
				refetchInterval: 5_000,
				placeholderData: keepPreviousData,
			}}
		>
			{({ data }) => {
				const lastLog = data.data[data.data.length - 1];
				const lastStatusLog = data.data.findLast((item) => item.event === "status");

				// biome-ignore lint/correctness/useHookAtTopLevel: We're OK
				// biome-ignore lint/correctness/useExhaustiveDependencies: We're OK
				useLayoutEffect(() => {
					const bottom = bottomRef.current;
					const container = containerRef.current;
					const content = contentRef.current;
					if (!bottom || !container || !content) {
						return;
					}

					const scrollToBottom = () => {
						bottom.scrollIntoView({
							block: "end",
							behavior: "smooth",
						});
					};

					scrollToBottom();

					const ro = new ResizeObserver(() => {
						scrollToBottom();
					});

					ro.observe(content);

					return () => {
						ro.disconnect();
					};
				}, [
					data.data.length,
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

								<div ref={bottomRef} />
							</Container>
						</Container>

						{isClosed ? null : (
							<TransactionChat
								locale={locale}
								side="buyer"
								listingTransactionLog={lastLog}
								components={components}
							/>
						)}
					</Container>
				);
			}}
		</withListingTransactionLogCollectionQuery.Suspense>
	);
};
