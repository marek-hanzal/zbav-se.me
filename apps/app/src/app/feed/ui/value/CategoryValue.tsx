import { EditIcon, Icon } from "@use-pico/client/icon";
import { translator } from "@use-pico/common/translator";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { CategoryValueList } from "~/app/category/ui/CategoryValueList";

export namespace CategoryValue {
	export interface Props
		extends Omit<CategoryValueList.Props, "categoryIdIn" | "textLabel" | "textEmpty"> {
		feed: tFeed;
	}
}

export const CategoryValue: FC<CategoryValue.Props> = ({ feed, ...props }) => {
	return (
		<CategoryValueList
			data-ui={"CategoryValue[CategoryValueList]"}
			categoryIdIn={feed.query?.filter?.categoryIdIn}
			textLabel={translator.text("Feed category (label)")}
			textEmpty={translator.text("Feed category not selected")}
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
