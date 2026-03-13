import type { MarkSuspense } from "@use-pico/client/type";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { Transaction } from "~/app/@buyer/transaction/~public/Transaction";
import { BackHomeButton } from "~/app/@common/nav/BackHomeButton";
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
	return (
		<TitleContainer
			textTitle={translator.text("Messages (title)")}
			left={<BackHomeButton />}
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
