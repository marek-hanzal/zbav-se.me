import { SpinnerContainer } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { BackHomeButton } from "~/app/@common/nav/BackHomeButton";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";

export namespace TransactionListingListPendingPage {
	export interface Props extends TitleContainer.Props {}
}

export const TransactionListingListPendingPage: FC<TransactionListingListPendingPage.Props> = (
	props,
) => {
	return (
		<TitleContainer
			data-ui="TransactionListingList[TitleContainer]"
			textTitle={translator.text("Messages (title)")}
			left={<BackHomeButton />}
			right={<HomeMenuButton />}
			{...props}
		>
			<SpinnerContainer />
		</TitleContainer>
	);
};
