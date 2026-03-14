import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import { translator } from "@use-pico/common/translator";
import type { tTransactionListingQuery } from "@zbav-se.me/sdk/api/seller";
import { withTransactionListingQuery } from "@zbav-se.me/sdk/query/seller/transaction-listing";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { BackHomeButton } from "~/app/@common/nav/BackHomeButton";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";
import { TransactionListingList } from "../ui/TransactionListingList";
import { Empty } from "../ui/TransactionListingList/Empty";

export namespace TransactionListingListPage {
	export interface Props extends TitleContainer.Props, MarkSuspense.Props {}
}

export const TransactionListingListPage: FC<TransactionListingListPage.Props> = ({
	_suspense,
	...props
}) => {
	const activeQuery: tTransactionListingQuery = {
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
	};

	const inactiveQuery: tTransactionListingQuery = {
		filter: {
			active: false,
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
	};

	const refetchInterval = 5_000;

	const { data: activeTransactionListingIds } = withTransactionListingQuery.useCollectionQuery(
		activeQuery,
		{
			refetchInterval,
		},
	);
	const { data: inactiveTransactionListingIds } = withTransactionListingQuery.useCollectionQuery(
		inactiveQuery,
		{
			refetchInterval,
		},
	);
	const isEmpty =
		activeTransactionListingIds.length === 0 && inactiveTransactionListingIds.length === 0;

	return (
		<TitleContainer
			data-ui="TransactionListingList[TitleContainer]"
			textTitle={translator.text("Messages (title)")}
			left={<BackHomeButton />}
			right={<HomeMenuButton />}
			{...props}
		>
			{isEmpty ? (
				<Empty />
			) : (
				<Container
					ui={{
						scroll: "vertical",
						height: "full",
						layout: "vertical-flex",
						gap: "2xl",
						inner: "default",
					}}
				>
					{activeTransactionListingIds.length > 0 ? (
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

							<TransactionListingList
								_suspense={_suspense}
								transactionListingIds={activeTransactionListingIds}
							/>
						</Container>
					) : null}

					{inactiveTransactionListingIds.length > 0 ? (
						<Container
							ui={{
								layout: "vertical-flex",
								gap: "default",
								opacity: "7",
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

							<TransactionListingList
								_suspense={_suspense}
								transactionListingIds={inactiveTransactionListingIds}
							/>
						</Container>
					) : null}
				</Container>
			)}
		</TitleContainer>
	);
};
