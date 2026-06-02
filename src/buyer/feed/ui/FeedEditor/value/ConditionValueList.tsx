import type { FC } from "react";
import { useTranslator } from "@/lib/client/translation";
import { ValueList } from "@/lib/client/value";

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

/**
 * Renders a read-only list of condition values in a consistent label/value style.
 * Use it in detail or preview views when you need to show multiple condition entries clearly.
 */
export const ConditionValueList: FC<ConditionValueList.Props> = ({ conditionIn, ...props }) => {
	const translator = useTranslator();
	return (
		<ValueList
			data-ui={"ConditionValueList"}
			textLabel={translator.text("Listing condition (label)")}
			textEmpty={translator.text("Listing condition not selected")}
			items={conditionIn.map((item) => ({
				id: String(item),
				condition: String(item),
			}))}
			renderFn={(item) => translator.text(`Condition ${item.condition} (label)`)}
			wrapperProps={{
				...(conditionIn.length > 0
					? {
							"data-ui-tone": "neutral",
							"data-ui-theme": "light",
						}
					: undefined),
			}}
			{...props}
		/>
	);
};
