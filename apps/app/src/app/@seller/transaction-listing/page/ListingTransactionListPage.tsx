import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tTransactionQuery } from "@zbav-se.me/sdk/api/seller";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/seller/transaction";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { BackHomeButton } from "~/app/@common/nav/BackHomeButton";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";
import { TransactionList } from "../ui/TransactionList";
import { ListingTransactionHeroData } from "./ListingTransactionHeroData";

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
		sort: [
			{
				field: "status",
				order: "asc",
			},
			{
				field: "createdAt",
				order: "desc",
			},
		],
	};
	const { data: transactionIds } = withTransactionQuery.useCollectionQuery(query);
	const transactionId = transactionIds[0];

	return (
		<TitleContainer
			data-ui="ListingTransactionList[TitleContainer]"
			textTitle={translator.text("Messages (title)")}
			left={<BackHomeButton />}
			right={<HomeMenuButton />}
			{...props}
		>
			<Container>
				{transactionId ? (
					<ListingTransactionHeroData transactionId={transactionId} />
				) : null}

				<TransactionList
					query={query}
					ui={{
						inner: "default",
					}}
				/>
			</Container>
		</TitleContainer>
	);
};
