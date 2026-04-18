import { type FC, Suspense } from "react";
import { useLocale } from "@/lib/client/locale";
import { translator } from "@/lib/common/translator";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";
import { DraftList } from "./DraftList";

export namespace DraftListPage {
	export interface Props extends TitleContainer.Props {
		//
	}
}

/**
 * Composes the draft-list page with title framing and sorted draft collection rendering.
 * Use it as the route-level screen for browsing and continuing seller draft edits.
 *
 * @see src/@routes
 */
export const DraftListPage: FC<DraftListPage.Props> = (props) => {
	const locale = useLocale();

	return (
		<TitleContainer
			textTitle={translator.text("Draft list (title)")}
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
			<Suspense fallback={<DraftList.Fallback />}>
				<DraftList
					_suspense={"I know"}
					data-ui-inner="default"
				/>
			</Suspense>
		</TitleContainer>
	);
};
