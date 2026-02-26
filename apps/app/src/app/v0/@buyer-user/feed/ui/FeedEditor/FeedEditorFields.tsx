import type { FC } from "react";
import type { FeedEditor } from "~/app/v0/@buyer-user/feed/ui/FeedEditor";
import { CategorySection } from "./CategorySection";
import { FilterSection } from "./FilterSection";
import { IdentitySection } from "./IdentitySection";
import { LocationSection } from "./LocationSection";
import { SortSection } from "./SortSection";
import { TitleSection } from "./TitleSection";

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
