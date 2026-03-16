import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, Suspense } from "react";
import { TransactionList } from "~/app/@buyer/transaction/~public/TransactionList";
import { BackHomeButton } from "~/app/@common/nav/BackHomeButton";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";

export namespace TransactionListPage {
	export interface Props extends TitleContainer.Props {
		//
	}
}

export const TransactionListPage: FC<TransactionListPage.Props> = (props) => {
	return (
		<TitleContainer
			textTitle={translator.text("Messages (title)")}
			left={<BackHomeButton />}
			right={<HomeMenuButton />}
			{...props}
		>
			<Suspense fallback={<TransactionList.Fallback />}>
				<TransactionList
					_suspense={"I know"}
					ui={{
						inner: "default",
					}}
				/>
			</Suspense>
		</TitleContainer>
	);
};
