import type { FC } from "react";
import { withFallback } from "@/lib/client/fallback";
import { useLocale } from "@/lib/client/locale";
import { handleArrowNav } from "@/lib/client/nav";
import { SpinnerContainer } from "@/lib/client/spinner";
import { translator } from "@/lib/common/translator";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";

export namespace EditorPage {
	export interface Props extends TitleContainer.Props {
		//
	}
}

export const EditorPage = withFallback<EditorPage.Props, FC<EditorPage.Props>>(
	(props) => {
		const locale = useLocale();

		return (
			<TitleContainer
				data-ui={"EditorPage"}
				textTitle={translator.text("Listing editor (title)")}
				left={
					<BackHomeButton
						id={"back-link"}
						to="/$locale/app/home"
						params={{
							locale,
						}}
						//
						data-arrow-right={"home-link"}
						onKeyDown={handleArrowNav}
					/>
				}
				right={
					<HomeMenuButton
						id={"home-link"}
						//
						data-arrow-left={"back-link"}
						onKeyDown={handleArrowNav}
					/>
				}
				{...props}
			>
				pico
			</TitleContainer>
		);
	},
	(props) => {
		const locale = useLocale();

		return (
			<TitleContainer
				data-ui={"EditorPage"}
				textTitle={translator.text("Listing editor (title)")}
				left={
					<BackHomeButton
						id={"back-link"}
						to="/$locale/app/home"
						params={{
							locale,
						}}
						//
						data-arrow-right={"home-link"}
						onKeyDown={handleArrowNav}
					/>
				}
				right={
					<HomeMenuButton
						id={"home-link"}
						//
						data-arrow-left={"back-link"}
						onKeyDown={handleArrowNav}
					/>
				}
				{...props}
			>
				<SpinnerContainer />
			</TitleContainer>
		);
	},
);
