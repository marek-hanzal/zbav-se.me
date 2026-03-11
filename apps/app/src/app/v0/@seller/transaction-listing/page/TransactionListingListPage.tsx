import type { MarkSuspense } from "@use-pico/client/type";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, Suspense } from "react";
import { BackHomeButton } from "~/app/@common/nav/BackHomeButton";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";
import { TransactionListingList } from "~/app/v0/@seller/transaction-listing/ui/TransactionListingList";
import { TransactionListingListPending } from "~/app/v0/@seller/transaction-listing/ui/TransactionListingListPending";

export namespace TransactionListingListPage {
	export interface Props extends TitleContainer.Props, MarkSuspense.Props {}
}

export const TransactionListingListPage: FC<TransactionListingListPage.Props> = ({
	_suspense,
	...props
}) => {
	return (
		<TitleContainer
			data-ui="SellerTransactionListingList[TitleContainer]"
			textTitle={translator.text("Messages (title)")}
			left={<BackHomeButton />}
			right={<HomeMenuButton />}
			{...props}
		>
			<Suspense fallback={<TransactionListingListPending />}>
				<TransactionListingList
					_suspense={"I know"}
					query={{
						sort: [
							{
								field: "createdAt",
								order: "desc",
							},
						],
					}}
					ui={{
						inner: "default",
					}}
				/>
			</Suspense>
		</TitleContainer>
	);
};
