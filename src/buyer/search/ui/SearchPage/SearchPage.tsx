import type { FC } from "react";
import { useLocale } from "@/lib/client/locale";
import { useTranslator } from "@/lib/client/translation";
import type { MarkSuspense } from "@/lib/client/type";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";
import { SearchEditor } from "./SearchEditor";

export namespace SearchPage {
	export interface Props extends TitleContainer.Props, MarkSuspense.Props {
		//
	}
}

/**
 * Composes the route-level search screen and arranges the main page structure for this flow.
 * Use it from route definitions as the primary UI boundary for the search journey.
 */
export const SearchPage: FC<SearchPage.Props> = ({ _suspense, ...props }) => {
	const translator = useTranslator();
	const locale = useLocale();
	const {
		data: { id: feedId },
	} = withFeedQuery.useEntityQuery({
		filter: {
			type: "search",
		},
		sort: [
			{
				field: "updatedAt",
				order: "desc",
			},
		],
	});

	return (
		<TitleContainer
			data-ui={"SearchPage"}
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
			<SearchEditor
				_suspense={_suspense}
				feedId={feedId}
			/>
		</TitleContainer>
	);
};
