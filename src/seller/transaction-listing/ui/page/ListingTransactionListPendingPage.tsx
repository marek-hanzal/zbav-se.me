import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { useLocale } from "@/lib/client/locale";
import { SpinnerContainer } from "@/lib/client/spinner";
import { translator } from "@/lib/common/translator";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";

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
				data-ui-layout="vertical-centered"
				data-ui-height="full"
				data-ui-inner="default"
			>
				<SpinnerContainer />
			</Container>
		</TitleContainer>
	);
};
