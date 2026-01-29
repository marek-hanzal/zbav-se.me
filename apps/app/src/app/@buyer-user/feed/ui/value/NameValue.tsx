import { EditIcon, Icon } from "@use-pico/client/icon";
import { LabelValue } from "@use-pico/client/ui/container";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import type { FC } from "react";

export namespace NameValue {
	export interface Props extends LabelValue.PropsEx {
		feed: tFeed;
	}
}

export const NameValue: FC<NameValue.Props> = ({ feed, ...props }) => {
	return (
		<LabelValue
			data-ui={"NameValue[LabelValue]"}
			textLabel={"Feed name (label)"}
			textValue={feed.name}
			action={
				<Icon
					icon={EditIcon}
					ui={{
						text: "xl",
					}}
				/>
			}
			wrapperProps={{
				ui: feed.name
					? {
							tone: "neutral",
							theme: "light",
						}
					: undefined,
			}}
			{...props}
		/>
	);
};
