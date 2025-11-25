import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import {
	type tListingTransactionLogQuery,
	type tUserSideEnum,
	zListingTransactionMessage,
	zListingTransactionStatus,
} from "@zbav-se.me/sdk/api/user";
import { withListingTransactionLogCollectionQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";
import { match } from "ts-pattern";
import { MessageEvent } from "./event/MessageEvent";
import { RequestEvent } from "./event/status/RequestEvent";

export namespace TransactionLogList {
	export interface Props extends Container.Props {
		locale: string;
		side: tUserSideEnum;
		query: tListingTransactionLogQuery;
		SellerInfo: RequestEvent.Info.Component;
		BuyerInfo: RequestEvent.Info.Component;
	}
}

export const TransactionLogList: FC<TransactionLogList.Props> = ({
	locale,
	side,
	query,
	SellerInfo,
	BuyerInfo,
	...props
}) => {
	return (
		<Container
			layout={"vertical-flex"}
			gap={"md"}
			{...props}
		>
			<withListingTransactionLogCollectionQuery.Suspense
				data={query}
				fallback={<SpinnerContainer />}
			>
				{({ data }) => {
					return data.data.map((log) => {
						return match(log.event)
							.with("status", () => (
								<RequestEvent
									key={log.id}
									locale={locale}
									side={side}
									listingTransactionStatus={zListingTransactionStatus.parse(log)}
									SellerInfo={SellerInfo}
									BuyerInfo={BuyerInfo}
								/>
							))
							.with("message", () => {
								return (
									<MessageEvent
										key={log.id}
										locale={locale}
										side={side}
										message={zListingTransactionMessage.parse(log)}
									/>
								);
							})
							.with("gallery", "location", () => {
								return null;
							})
							.exhaustive();
					});
				}}
			</withListingTransactionLogCollectionQuery.Suspense>
		</Container>
	);
};
