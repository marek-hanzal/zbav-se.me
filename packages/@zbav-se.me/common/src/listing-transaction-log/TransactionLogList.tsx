import type { Button } from "@use-pico/client/ui/button";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import {
	type tListingTransaction,
	type tListingTransactionLog,
	type tListingTransactionLogQuery,
	type tListingTransactionStatusEnum,
	type tUserSideEnum,
	zListingTransactionMessage,
	zListingTransactionStatus,
} from "@zbav-se.me/sdk/api/user";
import { withListingTransactionLogCollectionQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";
import { match } from "ts-pattern";
import { MessageEvent } from "./event/MessageEvent";
import { AcceptedEvent } from "./event/status/AcceptedEvent";
import { RejectedEvent } from "./event/status/RejectedEvent";
import { RequestEvent } from "./event/status/RequestEvent";

export namespace TransactionLogList {
	export namespace Components {
		export type SideInfoButton = FC<
			{
				locale: string;
				log: tListingTransactionLog;
			} & Button.Props
		>;
	}

	export interface Components {
		SellerInfoButton: Components.SideInfoButton;
		BuyerInfoButton: Components.SideInfoButton;
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
	const isClosed = (
		[
			"closed",
			"expired",
			"closed",
			"rejected",
		] satisfies tListingTransactionStatusEnum[] as tListingTransactionStatusEnum[]
	).includes(listingTransaction.status);

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
														components={components}
														isCurrent={isCurrent}
														isClosed={isClosed && isCurrent}
													/>
												);
											})
											.with("accepted", () => {
												return (
													<AcceptedEvent
														key={log.id}
														locale={locale}
														side={side}
														components={components}
														isCurrent={isCurrent}
														listingTransactionStatus={status}
														isClosed={isClosed && isCurrent}
													/>
												);
											})
											.with("rejected", () => {
												return (
													<RejectedEvent
														key={log.id}
														locale={locale}
														side={side}
														listingTransactionStatus={status}
														isCurrent={isCurrent}
														isClosed={isClosed && isCurrent}
													/>
												);
											})
											.with("closed", "expired", "success", () => {
												return "not-yet";
											})
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
												isClosed={isClosed && isCurrent}
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
