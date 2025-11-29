import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import type {
	tListingTransaction,
	tListingTransactionLogQuery,
	tListingTransactionStatusEnum,
	tUserSideEnum,
} from "@zbav-se.me/sdk/api/user";
import { withListingTransactionLogCollectionQuery } from "@zbav-se.me/sdk/query/user";
import { type FC, useLayoutEffect, useRef } from "react";
import { TransactionLogItem } from "./TransactionLogItem";

export namespace TransactionLogList {
	export interface Props extends Container.Props {
		locale: string;
		side: tUserSideEnum;
		query: tListingTransactionLogQuery;
		listingTransaction: tListingTransaction;
	}
}

export const TransactionLogList: FC<TransactionLogList.Props> = ({
	locale,
	side,
	query,
	listingTransaction,
	...props
}) => {
	const containerRef = useRef<HTMLDivElement>(null);

	return (
		<Container
			ref={containerRef}
			ui={"TransactionLogList-root"}
			layout={"vertical-flex"}
			scroll={"vertical"}
			gap={"md"}
			{...props}
		>
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
				}}
			>
				{({ data }) => {
					const currentLog = data.data[data.data.length - 1];
					const lastStatusLog = data.data.findLast((item) => item.event === "status");

					// biome-ignore lint/correctness/useHookAtTopLevel: We're OK
					// biome-ignore lint/correctness/useExhaustiveDependencies: We're OK
					useLayoutEffect(() => {
						const el = containerRef.current;
						if (!el) {
							return;
						}

						el.scrollTo({
							top: el.scrollHeight,
							behavior: "instant",
						});
					}, [
						data,
					]);

					/**
					 * If there is no last status, it's a logical bug, so we just won't render.
					 */
					if (!currentLog || !lastStatusLog) {
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

					return data.data.map((log) => {
						const isCurrent = currentLog.id === log.id;

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
					});
				}}
			</withListingTransactionLogCollectionQuery.Suspense>
		</Container>
	);
};
