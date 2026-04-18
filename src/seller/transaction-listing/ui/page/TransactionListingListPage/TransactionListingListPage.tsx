import { type FC, useMemo } from "react";
import { Container } from "@/lib/client/container";
import { EmptyState } from "@/lib/client/empty-state";
import { useLocale } from "@/lib/client/locale";
import type { MarkSuspense } from "@/lib/client/type";
import { translator } from "@/lib/common/translator";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { withListingQuery } from "~/seller/listing/query/withListingQuery";
import { withTransactionListingQuery } from "~/seller/transaction-listing/query/withTransactionListingQuery";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";
import { Empty } from "./Empty";
import { EmptyListings } from "./EmptyListings";
import { ListGroup } from "./ListGroup";

export namespace TransactionListingListPage {
	export interface Props extends TitleContainer.Props, MarkSuspense.Props {
		refetchInterval?: number;
	}
}

export const TransactionListingListPage: FC<TransactionListingListPage.Props> = ({
	_suspense,
	refetchInterval = 5_000,
	...props
}) => {
	const locale = useLocale();
	const { data: listingCollection } = withListingQuery.useCollectionQuery({
		cursor: {
			page: 0,
			size: 1,
		},
	});
	const { data: hasTransactionListing } = withTransactionListingQuery.useCollectionQuery(
		{
			cursor: {
				page: 0,
				size: 1,
			},
		},
		{
			refetchInterval,
		},
	);
	const check = useMemo(() => {
		return [
			{
				check() {
					return !listingCollection.length;
				},
				render() {
					return <EmptyListings />;
				},
			},
			{
				check() {
					return !hasTransactionListing.length;
				},
				render() {
					return <Empty />;
				},
			},
		] satisfies EmptyState.Check[];
	}, [
		hasTransactionListing,
		listingCollection,
	]);

	return (
		<TitleContainer
			data-ui="TransactionListingListPage"
			textTitle={translator.text("Messages (title)")}
			left={
				<BackHomeButton
					to="/$locale/app/home"
					params={{
						locale,
					}}
				/>
			}
			right={<HomeMenuButton />}
			{...props}
		>
			<EmptyState check={check}>
				<Container
					data-ui-scroll="vertical"
					data-ui-height="full"
					data-ui-layout="vertical-flex"
					data-ui-gap="2xl"
					data-ui-inner="default"
				>
					<ListGroup
						label={translator.text("Transactions - buyer-to-seller - seller (title)")}
						filter={{
							flow: "buyer-to-seller",
						}}
						refetchInterval={refetchInterval}
						typoProps={{
							"data-ui-tone": "neutral",
							"data-ui-theme": "light",
						}}
					/>

					<ListGroup
						label={translator.text("Transactions - seller-to-buyer - seller (title)")}
						filter={{
							flow: "seller-to-buyer",
						}}
						refetchInterval={refetchInterval}
						typoProps={{
							"data-ui-tone": "neutral",
							"data-ui-theme": "light",
							"data-ui-opacity": "7",
							"data-ui-font": "normal",
						}}
					/>

					<ListGroup
						label={translator.text("Transactions - archived - seller (title)")}
						filter={{
							flow: "archived",
						}}
						refetchInterval={refetchInterval}
						data-ui-opacity="7"
						typoProps={{
							"data-ui-tone": "neutral",
							"data-ui-theme": "light",
							"data-ui-opacity": "7",
							"data-ui-font": "normal",
						}}
					/>
				</Container>
			</EmptyState>
		</TitleContainer>
	);
};
