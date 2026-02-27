import { ValueList } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";

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
 *
 * @see apps/app/src/app/@seller-user/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const ConditionValueList: FC<ConditionValueList.Props> = ({ conditionIn, ...props }) => {
	return (
		<ValueList
			data-ui={"ConditionValueList[ValueList]"}
			textLabel={translator.text("Listing condition (label)")}
			textEmpty={translator.text("Listing condition not selected")}
			items={conditionIn.map((item) => ({
				id: String(item),
				condition: String(item),
			}))}
			renderFn={(item) => translator.text(`Condition ${item} (label)`)}
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
