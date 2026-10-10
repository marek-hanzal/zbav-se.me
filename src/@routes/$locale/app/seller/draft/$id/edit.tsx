import { createFileRoute } from "@tanstack/react-router";
import { useLocale } from "@/lib/client/locale";
import { handleArrowNav } from "@/lib/client/nav";
import { SpinnerContainer } from "@/lib/client/spinner";
import { useTranslator } from "@/lib/client/translation";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { DraftEditor } from "~/seller/draft/ui/DraftEditor";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";

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
			>
				<SpinnerContainer />
			</TitleContainer>
		);
	},
});
