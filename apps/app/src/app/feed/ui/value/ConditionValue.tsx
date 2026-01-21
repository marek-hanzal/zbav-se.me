import { EditIcon, Icon } from "@use-pico/client/icon";
import { ValueList } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { ConditionIcon } from "../../../condition/ui/ConditionIcon";

export namespace ConditionValue {
	export interface Props
		extends Omit<
			ValueList.PropsEx<{
				id: string;
				condition: string;
			}>,
			"items" | "renderFn"
		> {
		feed: tFeed;
	}
}

export const ConditionValue: FC<ConditionValue.Props> = ({ feed, ...props }) => {
	const conditionIn = feed.query?.filter?.conditionIn ?? [];

	return (
		<ValueList
			data-ui={"ConditionValue[ValueList]"}
			textLabel={translator.text("Feed condition (label)")}
			textEmpty={translator.text("Feed condition not selected")}
			items={conditionIn.map((item) => ({
				id: String(item),
				condition: String(item),
			}))}
			renderFn={(item) => <ConditionIcon condition={item.condition} />}
			action={
				<Icon
					icon={EditIcon}
					ui={{
						text: "xl",
					}}
				/>
			}
			wrapperProps={{
				ui:
					conditionIn.length > 0
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
