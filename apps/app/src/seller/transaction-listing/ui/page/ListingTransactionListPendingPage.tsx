import { translator } from "@use-pico/common/translator";
import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { useLocale } from "@/lib/client/locale";
import { SpinnerContainer } from "@/lib/client/spinner";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/~public/HomeMenuButton";

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
					to="/$locale/app/seller/transaction/list"
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
