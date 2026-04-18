import { type FC, Suspense } from "react";
import { useLocale } from "@/lib/client/locale";
import { translator } from "@/lib/common/translator";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";
import { FeedList } from "./FeedList";

export namespace FeedListPage {
	export interface Props extends TitleContainer.Props {
		//
	}
}

/**
 * Composes the feed-list page with title, navigation action, and feed list query defaults.
 * Use it as the route-level screen for browsing and managing buyer feed presets.
 *
 * @see src/@routes
 */
export const FeedListPage: FC<FeedListPage.Props> = ({ ...props }) => {
	const locale = useLocale();

	return (
		<TitleContainer
			data-ui={"FeedListPage"}
			textTitle={translator.text("Feed select (title)")}
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
			<Suspense fallback={<FeedList.Fallback />}>
				<FeedList _suspense={"I know"} />
			</Suspense>
		</TitleContainer>
	);
};
