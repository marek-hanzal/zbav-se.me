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
			ui={"TransactionLogList-root"}
			layout={"vertical-flex"}
			gap={"md"}
			{...props}
		>
			<withListingTransactionLogCollectionQuery.Suspense
				data={query}
				fallback={<SpinnerContainer />}
			>
				{({ data }) => {
					const currentLog = data.data[data.data.length - 1];

					if (!currentLog) {
						return null;
					}

					return (
						<>
							{data.data.map((log) => {
								const isCurrent = currentLog.id === log.id;

								return match(log.event)
									.with("status", () => {
										const status = zListingTransactionStatus.parse(log);

										return match(status.status)
											.with("request", () => {
												return (
													<RequestEvent
														key={log.id}
														locale={locale}
														side={side}
														listingTransactionStatus={status}
														SellerInfo={SellerInfo}
														BuyerInfo={BuyerInfo}
														isCurrent={isCurrent}
													/>
												);
											})
											.with(
												"accepted",
												"closed",
												"rejected",
												"expired",
												"success",
												() => {
													return "not-yet";
												},
											)
											.exhaustive();
									})
									.with("message", () => {
										const message = zListingTransactionMessage.parse(log);

										return (
											<MessageEvent
												key={log.id}
												locale={locale}
												side={side}
												message={message}
												isCurrent={isCurrent}
											/>
										);
									})
									.with("gallery", "location", () => {
										return null;
									})
									.exhaustive();
							})}
						</>
					);
				}}
			</withListingTransactionLogCollectionQuery.Suspense>
		</Container>
	);
};
