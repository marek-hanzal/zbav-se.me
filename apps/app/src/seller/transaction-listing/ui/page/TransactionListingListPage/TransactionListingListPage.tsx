import { EmptyState } from "@use-pico/client/ui/empty-state";
import { translator } from "@use-pico/common/translator";
import { type FC, useMemo } from "react";
import { Container } from "@/lib/client/container";
import { useLocale } from "@/lib/client/locale";
import type { MarkSuspense } from "@/lib/client/type";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { withListingQuery } from "~/seller/listing/query/withListingQuery";
import { withTransactionListingQuery } from "~/seller/transaction-listing/query/withTransactionListingQuery";
import { HomeMenuButton } from "~/user/home/~public/HomeMenuButton";
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
					ui={{
						scroll: "vertical",
						height: "full",
						layout: "vertical-flex",
						gap: "2xl",
						inner: "default",
					}}
				>
					<ListGroup
						label={translator.text("Messages active listings section (title)")}
						filter={{
							active: true,
						}}
						refetchInterval={refetchInterval}
						typoUi={{
							tone: "neutral",
							theme: "light",
						}}
					/>

					<ListGroup
						label={translator.text("Messages inactive listings section (title)")}
						filter={{
							active: false,
							terminal: false,
						}}
						refetchInterval={refetchInterval}
						typoUi={{
							tone: "neutral",
							theme: "light",
							opacity: "7",
						}}
					/>

					<ListGroup
						label={translator.text("Messages closed listings section (title)")}
						filter={{
							active: false,
							terminal: true,
						}}
						refetchInterval={refetchInterval}
						ui={{
							opacity: "7",
						}}
						typoUi={{
							tone: "neutral",
							theme: "light",
							opacity: "7",
						}}
					/>
				</Container>
			</EmptyState>
		</TitleContainer>
	);
};
