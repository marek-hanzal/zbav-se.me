import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { BackHomeButton } from "~/app/@common/nav/BackHomeButton";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";
import { Pending as ListingTransactionHeroPending } from "../ListingTransactionHero/Pending";

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
			right={<HomeMenuButton />}
			{...props}
		>
			<Container>
				<ListingTransactionHeroPending />

				<SpinnerContainer
					ui={{
						inner: "default",
					}}
				/>
			</Container>
		</TitleContainer>
	);
};
