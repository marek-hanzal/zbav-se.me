import { EditIcon, Icon } from "@use-pico/client/icon";
import { LabelValue } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";

export namespace TitleValue {
	export interface Props extends LabelValue.PropsEx {
		feed: tFeed;
	}
}

export const TitleValue: FC<TitleValue.Props> = ({ feed, ...props }) => {
	return (
		<LabelValue
			data-ui={"TitleValue[LabelValue]"}
			textLabel={translator.text("Feed title (label)")}
			textValue={feed.query?.filter?.title || null}
			textEmpty={translator.text("Feed title not filled")}
			textHint={translator.text("Feed title (hint)")}
			action={
				<Icon
					icon={EditIcon}
					ui={{
						text: "xl",
					}}
				/>
			}
			{...props}
		/>
	);
};
