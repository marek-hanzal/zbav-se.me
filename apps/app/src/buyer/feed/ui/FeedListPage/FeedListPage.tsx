import { useLocale } from "@use-pico/client/hook";
import { translator } from "@use-pico/common/translator";
import { type FC, Suspense } from "react";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/~public/HomeMenuButton";
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
 * @see apps/app/src/@routes
 */
export const FeedListPage: FC<FeedListPage.Props> = ({ ui, ...props }) => {
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
			ui={{
				layout: "vertical-header-content",
				...ui,
			}}
			right={<HomeMenuButton />}
			{...props}
		>
			<Suspense fallback={<FeedList.Fallback />}>
				<FeedList _suspense={"I know"} />
			</Suspense>
		</TitleContainer>
	);
};
