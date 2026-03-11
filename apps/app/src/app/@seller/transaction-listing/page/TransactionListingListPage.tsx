import type { MarkSuspense } from "@use-pico/client/type";
import { translator } from "@use-pico/common/translator";
import type { tTransactionListingQuery } from "@zbav-se.me/sdk/api/seller";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { BackHomeButton } from "~/app/@common/nav/BackHomeButton";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";
import { TransactionListingList } from "../ui/TransactionListingList";

export namespace TransactionListingListPage {
	export interface Props extends TitleContainer.Props, MarkSuspense.Props {}
}

export const TransactionListingListPage: FC<TransactionListingListPage.Props> = ({
	_suspense,
	...props
}) => {
	const query: tTransactionListingQuery = {
		sort: [
			{
				field: "lastAt",
				order: "desc",
			},
		],
	};

	return (
		<TitleContainer
			data-ui="TransactionListingList[TitleContainer]"
			textTitle={translator.text("Messages (title)")}
			left={<BackHomeButton />}
			right={<HomeMenuButton />}
			{...props}
		>
			<TransactionListingList
				_suspense={_suspense}
				query={query}
				ui={{
					inner: "default",
				}}
			/>
		</TitleContainer>
	);
};
