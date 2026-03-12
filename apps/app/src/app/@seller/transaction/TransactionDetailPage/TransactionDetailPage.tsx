import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, Suspense } from "react";
import { BackHomeButton } from "~/app/@common/nav/BackHomeButton";
import { Transaction } from "~/app/@seller/transaction/~public/Transaction";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";
import { TransactionPending } from "~/app/v0/@seller/transaction/ui/TransactionPending";
import { TransactionDetailInvalidate } from "./TransactionDetailInvalidate";

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
				<TransactionDetailInvalidate transactionId={transactionId} />

				<Transaction
					_suspense={"I know"}
					transactionId={transactionId}
					refresh={1_000 * 5}
				/>
			</Suspense>
		</TitleContainer>
	);
};
