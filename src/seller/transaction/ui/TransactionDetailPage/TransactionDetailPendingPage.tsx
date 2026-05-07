import type { FC } from "react";
import { useLocale } from "@/lib/client/locale";
import { SpinnerContainer } from "@/lib/client/spinner";
import { translator } from "@/lib/common/translation";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";

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
					to="/$locale/app/seller/transaction/list"
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
