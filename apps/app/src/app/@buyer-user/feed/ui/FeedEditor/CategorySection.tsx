import { ChevronRightIcon, Icon } from "@use-pico/client/icon";
import { Group } from "@use-pico/client/ui/group";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";
import type { FeedEditor } from "~/app/@buyer-user/feed/ui/FeedEditor";
import { CategoryValueList } from "~/app/@session/category/ui/CategoryValueList";

export namespace CategorySection {
	export interface Props extends Pick<FeedEditor.Props, "feed" | "values"> {}
}

export const CategorySection: FC<CategorySection.Props> = ({ feed, values }) => {
	return (
		<Group>
			<CategoryValueList
				categoryIdIn={feed.query?.filter?.categoryIdIn}
				textLabel={translator.text("Feed category (label)")}
				textEmpty={translator.text("Feed category not selected")}
				action={
					<Icon
						icon={ChevronRightIcon}
						ui={{
							text: "xl",
						}}
					/>
				}
				wrapperProps={{
					ui: {
						tone:
							(feed.query?.filter?.categoryIdIn ?? []).length > 0
								? "neutral"
								: "secondary",
					},
				}}
				{...values?.category}
			/>
		</Group>
	);
};
