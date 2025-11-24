import { Badge } from "@use-pico/client/ui/badge";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Markdown } from "@use-pico/client/ui/markdown";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import {
	type tListingTransactionLogQuery,
	type tUserSideEnum,
	zListingTransactionMessage,
	zListingTransactionStatus,
} from "@zbav-se.me/sdk/api/user";
import { withListingTransactionLogCollectionQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";
import { match } from "ts-pattern";
import { EventBadge } from "./EventBadge";
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
									locale={locale}
									side={side}
									listingTransactionStatus={zListingTransactionStatus.parse(log)}
									SellerInfo={SellerInfo}
									BuyerInfo={BuyerInfo}
								/>
							))
							.with("message", () => {
								const message = zListingTransactionMessage.parse(log);

								return (
									<EventBadge
										side={side}
										actor={message.side}
										renderSellerFn={undefined}
										renderBuyerFn={undefined}
										renderBuyerToSellerFn={(props) => {
											return (
												<Badge {...props}>
													<Typo
														label={toTimeDiff({
															locale,
															time: message.createdAt,
														})}
														font={"normal"}
														size={"sm"}
													/>

													<Markdown>{message.message}</Markdown>
												</Badge>
											);
										}}
										renderSellerToBuyerFn={(props) => {
											return (
												<Badge {...props}>
													<Typo
														label={toTimeDiff({
															locale,
															time: message.createdAt,
														})}
														font={"normal"}
														size={"sm"}
													/>

													<Markdown>{message.message}</Markdown>
												</Badge>
											);
										}}
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
