import type { FC } from "react";
import type { FeedEditor } from "~/app/@buyer-user/feed/ui/FeedEditor";
import { CategorySection } from "~/app/@buyer-user/feed/ui/feed-editor/CategorySection";
import { FilterSection } from "~/app/@buyer-user/feed/ui/feed-editor/FilterSection";
import { IdentitySection } from "~/app/@buyer-user/feed/ui/feed-editor/IdentitySection";
import { LocationSection } from "~/app/@buyer-user/feed/ui/feed-editor/LocationSection";
import { SortSection } from "~/app/@buyer-user/feed/ui/feed-editor/SortSection";
import { TitleSection } from "~/app/@buyer-user/feed/ui/feed-editor/TitleSection";

export namespace FeedEditorFields {
	export interface Props extends Pick<FeedEditor.Props, "feed" | "values"> {}
}

export const FeedEditorFields: FC<FeedEditorFields.Props> = ({ feed, values }) => {
	return (
		<>
			<IdentitySection
				feed={feed}
				values={values}
			/>

			<CategorySection
				feed={feed}
				values={values}
			/>

			<LocationSection
				feed={feed}
				values={values}
			/>

			<SortSection
				feed={feed}
				values={values}
			/>

			<FilterSection
				feed={feed}
				values={values}
			/>

			<TitleSection
				feed={feed}
				values={values}
			/>
		</>
	);
};
