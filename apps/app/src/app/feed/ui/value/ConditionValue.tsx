import { EditIcon, Icon } from "@use-pico/client/icon";
import { ValueList } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";

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
	const conditionIn = feed.query?.filter?.conditionIn;

	return (
		<ValueList
			data-ui={"ConditionValue[ValueList]"}
			textLabel={translator.text("Feed condition (label)")}
			textEmpty={translator.text("Feed condition not selected")}
			items={(conditionIn ?? []).map((item) => ({
				id: String(item),
				condition: String(item),
			}))}
			renderFn={(item) => (
				<Tx
					label={`Condition - Overall [${item.condition}] (hint)`}
					ui={{
						tone: "secondary",
					}}
				/>
			)}
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
