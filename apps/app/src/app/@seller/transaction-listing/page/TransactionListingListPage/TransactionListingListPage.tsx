import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { EmptyState } from "@use-pico/client/ui/empty-state";
import { Typo } from "@use-pico/client/ui/typo";
import { translator } from "@use-pico/common/translator";
import { withListingQuery } from "@zbav-se.me/sdk/query/seller/listing";
import { withTransactionListingQuery } from "@zbav-se.me/sdk/query/seller/transaction-listing";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, useMemo } from "react";
import { BackHomeButton } from "~/app/@common/nav/BackHomeButton";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";
import { Empty } from "./Empty";
import { EmptyListings } from "./EmptyListings";
import { TransactionListingList } from "./TransactionListingList";

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
	const { data: listingCollection } = withListingQuery.useCollectionQuery({
		cursor: {
			page: 0,
			size: 1,
		},
	});
	const { data: activeCollection } = withTransactionListingQuery.useCollectionQuery(
		{
			filter: {
				active: true,
			},
			cursor: {
				page: 0,
				size: 1000,
			},
			sort: [
				{
					field: "lastAt",
					order: "desc",
				},
			],
		},
		{
			refetchInterval,
		},
	);
	const { data: inactiveCollection } = withTransactionListingQuery.useCollectionQuery(
		{
			filter: {
				active: false,
				terminal: false,
			},
			cursor: {
				page: 0,
				size: 1000,
			},
			sort: [
				{
					field: "lastAt",
					order: "desc",
				},
			],
		},
		{
			refetchInterval,
		},
	);
	const { data: closedCollection } = withTransactionListingQuery.useCollectionQuery(
		{
			filter: {
				active: false,
				terminal: true,
			},
			cursor: {
				page: 0,
				size: 1000,
			},
			sort: [
				{
					field: "lastAt",
					order: "desc",
				},
			],
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
					return (
						activeCollection.length === 0 &&
						inactiveCollection.length === 0 &&
						closedCollection.length === 0
					);
				},
				render() {
					return <Empty />;
				},
			},
		] satisfies EmptyState.Check[];
	}, [
		listingCollection,
		activeCollection,
		inactiveCollection,
		closedCollection,
	]);

	return (
		<TitleContainer
			data-ui="TransactionListingListPage"
			textTitle={translator.text("Messages (title)")}
			left={<BackHomeButton />}
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
					{activeCollection.length > 0 ? (
						<Container
							ui={{
								layout: "vertical-flex",
								gap: "default",
							}}
						>
							<Typo
								label={translator.text("Messages active listings section (title)")}
								ui={{
									tone: "primary",
									theme: "light",
									text: "sm",
									font: "bold",
									color: "lead",
								}}
								className={"text-center"}
							/>

							<TransactionListingList transactionListingIds={activeCollection} />
						</Container>
					) : null}

					{inactiveCollection.length > 0 ? (
						<Container
							ui={{
								layout: "vertical-flex",
								gap: "default",
							}}
						>
							<Typo
								label={translator.text(
									"Messages inactive listings section (title)",
								)}
								ui={{
									tone: "neutral",
									theme: "light",
									text: "sm",
									font: "bold",
									color: "lead",
									opacity: "7",
								}}
								className={"text-center"}
							/>

							<TransactionListingList transactionListingIds={inactiveCollection} />
						</Container>
					) : null}

					{closedCollection.length > 0 ? (
						<Container
							ui={{
								layout: "vertical-flex",
								gap: "default",
								opacity: "7",
							}}
						>
							<Typo
								label={translator.text("Messages closed listings section (title)")}
								ui={{
									tone: "neutral",
									theme: "light",
									text: "sm",
									font: "bold",
									color: "lead",
									opacity: "7",
								}}
								className={"text-center"}
							/>

							<TransactionListingList transactionListingIds={closedCollection} />
						</Container>
					) : null}
				</Container>
			</EmptyState>
		</TitleContainer>
	);
};
