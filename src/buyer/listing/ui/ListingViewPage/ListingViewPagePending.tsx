import type { FC } from "react";
import { useLocale } from "@/lib/client/locale";
import { SpinnerContainer } from "@/lib/client/spinner";
import { useTranslator } from "@/lib/client/translation";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";

export namespace ListingViewPagePending {
	export interface Props extends TitleContainer.Props {
		//
	}
}

export const ListingViewPagePending: FC<ListingViewPagePending.Props> = (props) => {
	const translator = useTranslator();
	const locale = useLocale();

	return (
		<TitleContainer
			data-ui={"ListingViewPagePending"}
			textTitle={translator.text("Listing title (title)")}
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
