import type { FC } from "react";
import { useLocale } from "@/lib/client/locale";
import { useRenderLogger } from "@/lib/client/log";
import type { MarkSuspense } from "@/lib/client/type";
import { translator } from "@/lib/common/translator";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";
import { Transaction } from "../Transaction/Transaction";

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

	useRenderLogger("TransactionDetailPage");

	return (
		<TitleContainer
			data-ui={"TransactionDetailPage"}
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
				refresh={5 * 1_000}
			/>
		</TitleContainer>
	);
};
