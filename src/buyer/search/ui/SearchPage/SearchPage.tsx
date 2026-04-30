import { type FC, Suspense } from "react";
import { useLocale } from "@/lib/client/locale";
import { translator } from "@/lib/common/translation";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";
import { SearchEditor } from "./SearchEditor";

export namespace SearchPage {
	export interface Props extends TitleContainer.Props {
		feedId: string;
	}
}

/**
 * Composes the route-level search screen and arranges the main page structure for this flow.
 * Use it from route definitions as the primary UI boundary for the search journey.
 *
 * @see src/@routes
 */
export const SearchPage: FC<SearchPage.Props> = ({ feedId, ...props }) => {
	const locale = useLocale();

	return (
		<TitleContainer
			data-ui={"SearchPage[TitleContainer]"}
			textTitle={translator.text("Search (title)")}
			left={
				<BackHomeButton
					to="/$locale/app/home"
					params={{
						locale,
					}}
				/>
			}
			data-ui-layout="vertical-header-content"
			right={<HomeMenuButton />}
			{...props}
		>
			<Suspense fallback={<SearchEditor.Fallback />}>
				<SearchEditor
					_suspense={"I know"}
					feedId={feedId}
				/>
			</Suspense>
		</TitleContainer>
	);
};
