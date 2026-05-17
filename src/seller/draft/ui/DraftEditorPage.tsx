import type { FC } from "react";
import { withFallback } from "@/lib/client/fallback";
import { useLocale } from "@/lib/client/locale";
import { handleArrowNav } from "@/lib/client/nav";
import { SpinnerContainer } from "@/lib/client/spinner";
import { useTranslator } from "@/lib/client/translation";
import type { MarkSuspense } from "@/lib/client/type";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";
import { DraftEditor } from "./DraftEditor";

export namespace DraftEditorPage {
	export interface Props extends MarkSuspense.Props {
		draftId: string;
	}
}

export const DraftEditorPage = withFallback<
	DraftEditorPage.Props,
	FC<Omit<DraftEditorPage.Props, "draftId" | "_suspense">>
>(
	({ _suspense, draftId }) => {
		return (
			<DraftEditor
				_suspense={_suspense}
				draftId={draftId}
			/>
		);
	},
	(props) => {
		const translator = useTranslator();
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
