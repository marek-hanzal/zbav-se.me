import { useLocale } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { translator } from "@use-pico/common/translator";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/seller/transaction";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { BackHomeButton } from "~/app/@common/nav/BackHomeButton";
import { Transaction } from "~/app/@seller/transaction/~public/Transaction";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";

export namespace TransactionDetailPage {
	export interface Props extends TitleContainer.Props, MarkSuspense.Props {
		transactionId: string;
	}
}

export const TransactionDetailPage: FC<TransactionDetailPage.Props> = ({
	_suspense,
	transactionId,
	...props
}) => {
	const locale = useLocale();
	const { data: transaction } = withTransactionQuery.useFetchQuery(transactionId);

	return (
		<TitleContainer
			textTitle={translator.text("Messages (title)")}
			left={
				<BackHomeButton
					to="/$locale/seller/transaction/$listingId/list"
					params={{
						locale,
						listingId: transaction.listingId,
					}}
				/>
			}
			right={<HomeMenuButton />}
			{...props}
		>
			<Transaction
				_suspense={_suspense}
				transactionId={transactionId}
				refresh={1_000 * 5}
			/>
		</TitleContainer>
	);
};
