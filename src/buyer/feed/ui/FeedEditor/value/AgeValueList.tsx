import type { FC } from "react";
import { ValueList } from "@/lib/client/value";
import { translator } from "@/lib/common/translator";

export namespace AgeValueList {
	export interface Props
		extends Omit<
			ValueList.PropsEx<{
				id: string;
				age: string;
			}>,
			"items" | "renderFn"
		> {
		ageIn: number[];
	}
}

/**
 * Renders a read-only list of age values in a consistent label/value style.
 * Use it in detail or preview views when you need to show multiple age entries clearly.
 *
 * @see src/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const AgeValueList: FC<AgeValueList.Props> = ({ ageIn, ...props }) => {
	return (
		<ValueList
			data-ui={"AgeValueList[ValueList]"}
			textLabel={translator.text("Feed age (label)")}
			textEmpty={translator.text("Feed age not selected")}
			textHint={translator.text("Feed age (hint)")}
			items={ageIn.map((item) => ({
				id: String(item),
				age: String(item),
			}))}
			renderFn={(item) => translator.text(`Age ${item.age} (label)`)}
			wrapperProps={{
				...(ageIn.length > 0
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
