import { translator } from "@use-pico/common/translator";
import type { FC } from "react";
import { Item } from "./Item";

export namespace ContentItemPending {
	export interface Props extends Item.PropsEx {
		feedId: string;
	}
}

export const ContentItemPending: FC<ContentItemPending.Props> = ({
	feedId,
	defaultOpen = false,
	tools,
	linkTo,
}) => {
	return (
		<Item
			feed={{
				id: feedId,
				locationId: null,
				name: translator.text("Loading... (label)"),
				query: {},
				upload: null,
				uploadId: null,
			}}
			defaultOpen={defaultOpen}
			tools={tools}
			linkTo={linkTo}
		/>
	);
};
