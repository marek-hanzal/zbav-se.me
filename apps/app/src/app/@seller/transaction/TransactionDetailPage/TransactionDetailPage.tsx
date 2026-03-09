import { useLocale } from "@use-pico/client/hook";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { uiBackButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";
import { Suspense } from "react";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";
import { Transaction } from "~/app/v0/@seller/transaction/ui/Transaction";
import { TransactionPending } from "~/app/v0/@seller/transaction/ui/TransactionPending";

export namespace TransactionDetailPage {
	export interface Props extends TitleContainer.Props {
		transactionId: string;
	}
}

export const TransactionDetailPage: FC<TransactionDetailPage.Props> = ({
	transactionId,
	...props
}) => {
	const locale = useLocale();

	return (
		<TitleContainer
			textTitle={translator.text("Messages (title)")}
			left={
				<LinkTo
					{...uiBackButton({
						className: [],
					})}
					icon={ArrowLeftIcon}
					to="/$locale/home"
					params={{
						locale,
					}}
				/>
			}
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
