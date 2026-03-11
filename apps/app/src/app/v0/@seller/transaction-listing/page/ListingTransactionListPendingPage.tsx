import { SpinnerContainer } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { BackHomeButton } from "~/app/@common/nav/BackHomeButton";

export namespace ListingTransactionListPendingPage {
	export interface Props extends TitleContainer.Props {}
}

export const ListingTransactionListPendingPage: FC<ListingTransactionListPendingPage.Props> = (
	props,
) => {
	return (
		<TitleContainer
			data-ui="ListingTransactionList[TitleContainer]"
			textTitle={translator.text("Messages (title)")}
			left={<BackHomeButton />}
			{...props}
		>
			<SpinnerContainer />
		</TitleContainer>
	);
};
