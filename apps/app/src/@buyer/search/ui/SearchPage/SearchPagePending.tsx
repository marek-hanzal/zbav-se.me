import { useLocale } from "@use-pico/client/hook";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { BackHomeButton } from "~/@common/nav/BackHomeButton";
import { HomeMenuButton } from "~/@user/home/~public/HomeMenuButton";

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
