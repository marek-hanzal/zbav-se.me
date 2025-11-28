import type { Button } from "@use-pico/client/ui/button";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import type {
	tListingTransaction,
	tListingTransactionLog,
	tListingTransactionLogQuery,
	tListingTransactionStatusEnum,
	tUserSideEnum,
} from "@zbav-se.me/sdk/api/user";
import { withListingTransactionLogCollectionQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";
import { TransactionLogItem } from "./TransactionLogItem";

export namespace TransactionLogList {
	export namespace Components {
		export type SideInfoButton = FC<
			{
				locale: string;
				log: tListingTransactionLog;
				modalRootId?: string;
			} & Button.Props
		>;

		export type ListingDetailButton = FC<
			{
				modalRootId: string;
			} & Button.Props
		>;
	}

	export interface Components {
		SellerInfoButton: Components.SideInfoButton;
		BuyerInfoButton: Components.SideInfoButton;
		ListingDetailButton: Components.ListingDetailButton;
	}

	export interface Props extends Container.Props {
		locale: string;
		side: tUserSideEnum;
		query: tListingTransactionLogQuery;
		listingTransaction: tListingTransaction;
		components: Components;
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
	return (
		<Container
			ui={"TransactionLogList-root"}
			layout={"vertical-flex"}
			gap={"md"}
			{...props}
		>
			<withListingTransactionLogCollectionQuery.Suspense
				data={query}
				fallback={<SpinnerContainer />}
				options={{
					refetchInterval: 5_000,
				}}
			>
				{({ data }) => {
					const currentLog = data.data[data.data.length - 1];
					const lastStatusLog = data.data.findLast((item) => item.event === "status");

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
								components={components}
							/>
						);
					});
				}}
			</withListingTransactionLogCollectionQuery.Suspense>
		</Container>
	);
};
