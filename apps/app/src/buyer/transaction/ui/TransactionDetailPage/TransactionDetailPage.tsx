import { translator } from "@use-pico/common/translator";
import type { FC } from "react";
import { useLocale } from "@/lib/client/locale";
import type { MarkSuspense } from "@/lib/client/type";
import { Transaction } from "~/buyer/transaction/~public/Transaction";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/~public/HomeMenuButton";

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

	return (
		<TitleContainer
			textTitle={translator.text("Messages (title)")}
			left={
				<BackHomeButton
					to="/$locale/app/buyer/transaction/list"
					params={{
						locale,
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
