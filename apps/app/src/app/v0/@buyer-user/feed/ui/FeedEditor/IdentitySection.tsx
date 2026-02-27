import { ChevronRightIcon, Icon } from "@use-pico/client/icon";
import { Group } from "@use-pico/client/ui/group";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";
import { NameValue } from "~/app/@common/name/ui/NameValue";
import type { FeedEditor } from "~/app/v0/@buyer-user/feed/ui/FeedEditor";
import { GalleryValue } from "~/app/v0/@common/gallery/ui/GalleryValue";

export namespace IdentitySection {
	export interface Props extends Pick<FeedEditor.Props, "feed" | "values"> {}
}

export const IdentitySection: FC<IdentitySection.Props> = ({ feed, values }) => {
	return (
		<Group>
			<GalleryValue
				label={translator.text("Feed photo gallery (label)")}
				uploads={
					feed.upload
						? [
								feed.upload,
							]
						: []
				}
				{...values?.gallery}
			/>

			<NameValue
				name={feed.name}
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
						tone: feed.name ? "neutral" : "secondary",
					},
				}}
				{...values?.name}
			/>
		</Group>
	);
};
