import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import {
	type tListingTransactionLogQuery,
	type tUserSideEnum,
	zListingTransactionStatus,
} from "@zbav-se.me/sdk/api/user";
import { withListingTransactionLogCollectionQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";
import { match } from "ts-pattern";
import { RequestEvent } from "./event/status/RequestEvent";

export namespace TransactionLogList {
	export interface Props extends Container.Props {
		locale: string;
		side: tUserSideEnum;
		query: tListingTransactionLogQuery;
	}
}

export const TransactionLogList: FC<TransactionLogList.Props> = ({
	locale,
	side,
	query,
	...props
}) => {
	return (
		<Container {...props}>
			<withListingTransactionLogCollectionQuery.Suspense
				data={query}
				fallback={<SpinnerContainer />}
			>
				{({ data }) => {
					return data.data.map((log) => {
						return match(log.event)
							.with("status", () => (
								<RequestEvent
									side={side}
									listingTransactionStatus={zListingTransactionStatus.parse(log)}
								/>
							))
							.with("gallery", "location", "message", () => {
								return null;
							})
							.exhaustive();
					});
				}}
			</withListingTransactionLogCollectionQuery.Suspense>
		</Container>
	);
};
