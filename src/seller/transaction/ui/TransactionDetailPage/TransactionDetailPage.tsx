import type { FC } from "react";
import { useLocale } from "@/lib/client/locale";
import type { MarkSuspense } from "@/lib/client/type";
import { translator } from "@/lib/common/translation";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { Transaction } from "~/seller/transaction/ui/Transaction";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";
import { withTransactionQuery } from "../../query/withTransactionQuery";

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
					to="/$locale/app/seller/transaction/$listingId/list"
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
