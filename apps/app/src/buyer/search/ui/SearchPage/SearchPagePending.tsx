import { SpinnerContainer } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";
import { useLocale } from "@/lib/client/locale";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/~public/HomeMenuButton";

export namespace SearchPagePending {
	export interface Props extends TitleContainer.Props {
		//
	}
}

export const SearchPagePending: FC<SearchPagePending.Props> = ({ ui, ...props }) => {
	const locale = useLocale();

	return (
		<TitleContainer
			data-ui={"SearchPagePending[TitleContainer]"}
			textTitle={translator.text("Search (title)")}
			left={
				<BackHomeButton
					to="/$locale/app/home"
					params={{
						locale,
					}}
				/>
			}
			ui={{
				layout: "vertical-header-content",
				...ui,
			}}
			right={<HomeMenuButton />}
			{...props}
		>
			<SpinnerContainer />
		</TitleContainer>
	);
};
