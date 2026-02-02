import { ValueList } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";
import { ConditionIcon } from "~/app/@common/condition/ui/ConditionIcon";

export namespace ConditionValueList {
	export interface Props
		extends Omit<
			ValueList.PropsEx<{
				id: string;
				condition: string;
			}>,
			"items" | "renderFn"
		> {
		conditionIn: number[];
	}
}

export const ConditionValueList: FC<ConditionValueList.Props> = ({
	conditionIn,
	...props
}) => {
	return (
		<ValueList
			data-ui={"ConditionValueList[ValueList]"}
			textLabel={translator.text("Feed condition (label)")}
			textEmpty={translator.text("Feed condition not selected")}
			items={conditionIn.map((item) => ({
				id: String(item),
				condition: String(item),
			}))}
			renderFn={(item) => <ConditionIcon condition={item.condition} />}
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
