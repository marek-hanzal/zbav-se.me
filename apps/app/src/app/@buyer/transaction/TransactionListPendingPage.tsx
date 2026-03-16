import { useLocale } from "@use-pico/client/hook";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { BackHomeButton } from "~/app/@common/nav/BackHomeButton";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";

export namespace TransactionListPendingPage {
	export interface Props extends TitleContainer.Props {}
}

export const TransactionListPendingPage: FC<TransactionListPendingPage.Props> = (props) => {
	const locale = useLocale();

	return (
		<TitleContainer
			data-ui="TransactionList[TitleContainer]"
			textTitle={translator.text("Messages (title)")}
			left={
				<BackHomeButton
					to="/$locale/home"
					params={{
						locale,
					}}
				/>
			}
			right={<HomeMenuButton />}
			{...props}
		>
			<SpinnerContainer />
		</TitleContainer>
	);
};
