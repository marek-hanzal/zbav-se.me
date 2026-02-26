import { ChevronRightIcon, Icon } from "@use-pico/client/icon";
import { Group } from "@use-pico/client/ui/group";
import type { FC } from "react";
import type { FeedEditor } from "~/app/v0/@buyer-user/feed/ui/FeedEditor";
import { SortValue } from "~/app/v0/@common/sort/ui/SortValue";

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
