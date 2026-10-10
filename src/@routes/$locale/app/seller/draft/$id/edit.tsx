import { createFileRoute } from "@tanstack/react-router";
import { TitleContainer } from "~/application-ui/ui/container.exports";
import { useLocale } from "~/locale/hook/useLocale";
import { BackHomeButton } from "~/nav/ui/BackHomeButton.exports";
import { handleArrowNavFn } from "~/navigation/fn/handleArrowNavFn";
import { DraftEditor } from "~/seller-draft/ui/DraftEditor";
import { useTranslator } from "~/translation/hook/useTranslator";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { HomeMenuButton } from "~/user-home/ui/HomeMenu/HomeMenuButton";

export const Route = createFileRoute("/$locale/app/seller/draft/$id/edit")({
	component() {
		const { id } = Route.useParams();

		const draftId = id;

		return (
			<DraftEditor
				_suspense={"I know"}
				draftId={draftId}
			/>
		);
	},
	pendingComponent: () => {
		const translator = useTranslator();
		const locale = useLocale();

		return (
			<TitleContainer
				data-ui={"DraftEditor[TitleContainer]"}
				textTitle={translator.textFn("Listing editor (title)")}
				left={
					<BackHomeButton
						id={"back-link"}
						to="/$locale/app/home"
						params={{
							locale,
						}}
						//
						data-arrow-right={"home-link"}
						onKeyDown={handleArrowNavFn}
					/>
				}
				right={
					<HomeMenuButton
						id={"home-link"}
						//
						data-arrow-left={"back-link"}
						onKeyDown={handleArrowNavFn}
					/>
				}
			>
				<SpinnerContainer />
			</TitleContainer>
		);
	},
});
