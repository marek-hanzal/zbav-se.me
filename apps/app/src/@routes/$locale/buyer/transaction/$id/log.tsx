import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { TransactionLogList } from "@zbav-se.me/common/listing-transaction-log";
import type { tListingTransactionLogQuery } from "@zbav-se.me/sdk/api/user";
import { withListingTransactionFetchQuery } from "@zbav-se.me/sdk/query/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useMemo } from "react";

export const Route = createFileRoute("/$locale/buyer/transaction/$id/log")({
	component() {
		const { locale, id } = Route.useParams();

		const query: tListingTransactionLogQuery = useMemo(() => {
			return {
				where: {
					listingTransactionId: id,
				},
				sort: [
					{
						field: "createdAt",
						direction: "asc",
					},
				],
			};
		}, [
			id,
		]);

		return (
			<TitleContainer
				textTitle={"Transaction detail (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/transaction/list"}
						params={{
							locale,
						}}
					/>
				}
			>
				<withListingTransactionFetchQuery.Suspense
					data={{
						where: {
							id,
						},
						meta: {
							side: "buyer",
						},
					}}
					fallback={<SpinnerContainer />}
				>
					{({ data }) => {
						return (
							<TransactionLogList
								_suspense={"I know"}
								locale={locale}
								side="buyer"
								listingTransaction={data}
								query={query}
								height={"auto"}
							/>
						);
					}}
				</withListingTransactionFetchQuery.Suspense>
			</TitleContainer>
		);
	},
});
