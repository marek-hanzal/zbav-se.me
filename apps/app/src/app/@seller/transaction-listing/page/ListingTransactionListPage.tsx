import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tTransactionQuery } from "@zbav-se.me/sdk/api/seller";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { BackHomeButton } from "~/app/@common/nav/BackHomeButton";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";
import { ListingTransactionHero } from "../ListingTransactionHero";
import { TransactionList } from "../ui/TransactionList";

export namespace ListingTransactionListPage {
	export interface Props extends TitleContainer.Props, MarkSuspense.Props {
		listingId: string;
	}
}

export const ListingTransactionListPage: FC<ListingTransactionListPage.Props> = ({
	_suspense,
	listingId,
	...props
}) => {
	const query: tTransactionQuery = {
		where: {
			listingId,
		},
		cursor: {
			page: 0,
			size: 1000,
		},
		sort: [
			{
				field: "status",
				order: "asc",
			},
			{
				field: "updatedAt",
				order: "desc",
			},
		],
	};

	return (
		<TitleContainer
			data-ui="ListingTransactionList[TitleContainer]"
			textTitle={translator.text("Messages (title)")}
			left={<BackHomeButton />}
			right={<HomeMenuButton />}
			{...props}
		>
			<Container>
				<ListingTransactionHero
					_suspense={_suspense}
					listingId={listingId}
				/>

				<TransactionList
					_suspense={_suspense}
					query={query}
					ui={{
						inner: "default",
					}}
				/>
			</Container>
		</TitleContainer>
	);
};
