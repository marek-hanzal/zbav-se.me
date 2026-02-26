import { ChevronRightIcon, Icon } from "@use-pico/client/icon";
import { Group } from "@use-pico/client/ui/group";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";
import type { FeedEditor } from "~/app/v0/@buyer-user/feed/ui/FeedEditor";
import { TitleValue } from "~/app/v0/@common/title/ui/TitleValue";

export namespace TitleSection {
	export interface Props extends Pick<FeedEditor.Props, "feed" | "values"> {}
}

export const TitleSection: FC<TitleSection.Props> = ({ feed, values }) => {
	return (
		<Group>
			<TitleValue
				title={feed.query?.filter?.title ?? null}
				textLabel={translator.text("Feed title (label)")}
				textEmpty={translator.text("Feed title not filled")}
				textHint={translator.text("Feed title (hint)")}
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
						tone: feed.query?.filter?.title ? "neutral" : "secondary",
					},
				}}
				{...values?.title}
			/>
		</Group>
	);
};
