import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { Suspense } from "react";
import { BackHomeButton } from "~/app/@common/nav/BackHomeButton";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";
import { Transaction } from "~/app/v0/@buyer/transaction/ui/Transaction";
import { TransactionPending } from "~/app/v0/@buyer/transaction/ui/TransactionPending";

export namespace TransactionDetailPage {
	export interface Props extends TitleContainer.Props {
		transactionId: string;
	}
}

export const TransactionDetailPage: FC<TransactionDetailPage.Props> = ({
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
			<Suspense fallback={<TransactionPending />}>
				<Transaction
					_suspense={"I know"}
					transactionId={transactionId}
					refresh={1_000 * 5}
				/>
			</Suspense>
		</TitleContainer>
	);
};
