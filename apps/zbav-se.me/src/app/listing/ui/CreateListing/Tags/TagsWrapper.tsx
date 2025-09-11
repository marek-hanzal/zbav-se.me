import { Tx } from "@use-pico/client";
import type { Cls } from "@use-pico/cls";
import type { FC } from "react";
import { TagIcon } from "~/app/ui/icon/TagIcon";
import { Title } from "~/app/ui/title/Title";
import type { TitleCls } from "~/app/ui/title/TitleCls";

export namespace TagsWrapper {
	export interface Props {
		subtitleVariant?: Cls.VariantsOf<TitleCls>;
	}
}

export const TagsWrapper: FC<TagsWrapper.Props> = ({
	subtitleVariant = {
		tone: "secondary",
		size: "lg",
	},
}) => {
	return (
		<Title
			icon={TagIcon}
			{...subtitleVariant}
		>
			<Tx label={"Tags (title)"} />
		</Title>
	);
};
