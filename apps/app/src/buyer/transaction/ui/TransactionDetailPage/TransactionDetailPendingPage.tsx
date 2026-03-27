import { useLocale } from "@use-pico/client/hook";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { HomeMenuButton } from "~/user/home/~public/HomeMenuButton";

export namespace TransactionDetailPendingPage {
	export interface Props extends TitleContainer.Props {}
}

export const TransactionDetailPendingPage: FC<TransactionDetailPendingPage.Props> = (props) => {
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
			<SpinnerContainer />
		</TitleContainer>
	);
};
