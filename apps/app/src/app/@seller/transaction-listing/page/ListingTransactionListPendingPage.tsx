import { useLocale } from "@use-pico/client/hook";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { BackHomeButton } from "~/app/@common/nav/BackHomeButton";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";

export namespace ListingTransactionListPendingPage {
	export interface Props extends TitleContainer.Props {}
}

export const ListingTransactionListPendingPage: FC<ListingTransactionListPendingPage.Props> = (
	props,
) => {
	const locale = useLocale();

	return (
		<TitleContainer
			data-ui="ListingTransactionList[TitleContainer]"
			textTitle={translator.text("Messages (title)")}
			left={
				<BackHomeButton
					to="/$locale/seller/transaction/list"
					params={{
						locale,
					}}
				/>
			}
			right={<HomeMenuButton />}
			{...props}
		>
			<Container
				ui={{
					layout: "vertical-centered",
					height: "full",
					inner: "default",
				}}
			>
				<SpinnerContainer />
			</Container>
		</TitleContainer>
	);
};
