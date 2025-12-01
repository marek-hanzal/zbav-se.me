import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { TransactionLogList } from "@zbav-se.me/common/listing-transaction-log";
import type { tListingTransactionLogQuery } from "@zbav-se.me/sdk/api/user";
import { withListingTransactionFetchQuery } from "@zbav-se.me/sdk/query/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useMemo } from "react";

export const Route = createFileRoute("/$locale/seller/transaction/$id/log")({
	pendingComponent() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer
				ui="TransactionView-root"
				textTitle={"Transaction detail (title)"}
				textSubtitle={"..."}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/seller/transaction/list"}
						params={{
							locale,
						}}
					/>
				}
			>
				<SpinnerContainer />
			</TitleContainer>
		);
	},
	component() {
		const { locale, id } = Route.useParams();

		const listingTransactionFetchQuery = withListingTransactionFetchQuery.useSuspenseQuery({
			where: {
				id,
			},
			meta: {
				side: "seller",
			},
		});

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
				ui="TransactionView-root"
				textTitle="Transaction detail (title)"
				textSubtitle={listingTransactionFetchQuery.data.title}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/seller/transaction/list"}
						params={{
							locale,
						}}
					/>
				}
			>
				<TransactionLogList
					_suspense={"I know"}
					locale={locale}
					side="seller"
					listingTransaction={listingTransactionFetchQuery.data}
					query={query}
				/>
			</TitleContainer>
		);
	},
});
