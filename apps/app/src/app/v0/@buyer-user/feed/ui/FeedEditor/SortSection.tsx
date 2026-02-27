import { ChevronRightIcon, Icon } from "@use-pico/client/icon";
import { Group } from "@use-pico/client/ui/group";
import type { FC } from "react";
import { SortValue } from "~/app/@common/sort/ui/SortValue";
import type { FeedEditor } from "~/app/v0/@buyer-user/feed/ui/FeedEditor";

export namespace SortSection {
	export interface Props extends Pick<FeedEditor.Props, "feed" | "values"> {}
}

export const SortSection: FC<SortSection.Props> = ({ feed, values }) => {
	return (
		<Group>
			<SortValue
				sort={feed.query?.sort ?? []}
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
						tone: (feed.query?.sort ?? []).length > 0 ? "neutral" : "secondary",
					},
				}}
				{...values?.sort}
			/>
		</Group>
	);
};
