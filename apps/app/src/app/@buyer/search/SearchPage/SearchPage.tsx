import { useLocale } from "@use-pico/client/hook";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, Suspense } from "react";
import { BackHomeButton } from "~/app/@common/nav/BackHomeButton";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";
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
 * @see apps/app/src/@routes
 */
export const SearchPage: FC<SearchPage.Props> = ({ feedId, ui, ...props }) => {
	const locale = useLocale();

	return (
		<TitleContainer
			data-ui={"SearchPage[TitleContainer]"}
			textTitle={translator.text("Search (title)")}
			left={
				<BackHomeButton
					to="/$locale/home"
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
			<Suspense fallback={<SearchEditor.Fallback />}>
				<SearchEditor
					_suspense={"I know"}
					feedId={feedId}
				/>
			</Suspense>
		</TitleContainer>
	);
};
