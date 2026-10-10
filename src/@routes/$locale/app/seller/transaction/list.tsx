import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { TitleContainer } from "~/application-ui/ui/container.exports";
import { useLocale } from "~/locale/hook/useLocale";
import { BackHomeButton } from "~/nav/ui/BackHomeButton.exports";
import { withListingQuery } from "~/seller-listing/query/withListingQuery";
import { Empty } from "~/seller-listing/ui/TransactionListingList/Empty";
import { EmptyListings } from "~/seller-listing/ui/TransactionListingList/EmptyListings";
import { ListGroup } from "~/seller-listing/ui/TransactionListingList/ListGroup";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Container } from "~/ui/ui/Container";
import { EmptyState } from "~/ui/ui/EmptyState";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { HomeMenuButton } from "~/user-home/ui/HomeMenu/HomeMenuButton";

export const Route = createFileRoute("/$locale/app/seller/transaction/list")({
	pendingComponent: () => {
		const translator = useTranslator();
		const locale = useLocale();

		return (
			<TitleContainer
				data-ui="TransactionListingList[TitleContainer]"
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
			>
				<SpinnerContainer />
			</TitleContainer>
		);
	},
	component() {
		const refetchInterval = 5_000;

		const translator = useTranslator();
		const locale = useLocale();
		const { data: listingCollection } = withListingQuery.useCollectionQuery({
			cursor: {
				page: 0,
				size: 1,
			},
		});
		const { data: hasTransactionListing } = withListingQuery.useCollectionQuery(
			{
				cursor: {
					page: 0,
					size: 1,
				},
				where: {
					withTransaction: true,
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
				data-ui="TransactionListingList[TitleContainer]"
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
							label={translator.text(
								"Transactions - buyer-to-seller - seller (title)",
							)}
							where={{
								flow: "buyer-to-seller",
							}}
							refetchInterval={refetchInterval}
							typoProps={{
								"data-ui-tone": "neutral",
								"data-ui-theme": "light",
							}}
						/>

						<ListGroup
							label={translator.text(
								"Transactions - seller-to-buyer - seller (title)",
							)}
							where={{
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
							where={{
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
	},
});
