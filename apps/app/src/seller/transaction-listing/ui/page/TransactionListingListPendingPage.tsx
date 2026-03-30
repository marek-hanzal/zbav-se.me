import { translator } from "@use-pico/common/translator";
import type { FC } from "react";
import { useLocale } from "@/lib/client/locale";
import { SpinnerContainer } from "@/lib/client/spinner";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/~public/HomeMenuButton";

export namespace TransactionListingListPendingPage {
	export interface Props extends TitleContainer.Props {}
}

export const TransactionListingListPendingPage: FC<TransactionListingListPendingPage.Props> = (
	props,
) => {
	const locale = useLocale();

	return (
		<TitleContainer
			data-ui="TransactionListingList[TitleContainer]"
			textTitle={translator.text("Messages (title)")}
			left={
				<BackHomeButton
					to="/$locale/app/home"
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
