import type { FC } from "react";
import { Tx } from "@/lib/client/tx";
import { ValueList } from "@/lib/client/value";
import { translator } from "@/lib/common/translator";

export namespace ProsValueList {
	export interface Props
		extends Omit<
			ValueList.Props<{
				id: string;
				pro: string;
			}>,
			"items" | "renderFn" | "textLabel" | "textEmpty"
		> {
		pros: string[];
	}
}

/**
 * Renders a read-only list of pros values in a consistent label/value style.
 * Use it in detail or preview views when you need to show multiple pros entries clearly.
 *
 * @see src/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const ProsValueList: FC<ProsValueList.Props> = ({ pros, ...props }) => {
	const prosItems = pros.map((pro, index) => ({
		id: String(index),
		pro,
	}));

	return (
		<ValueList
			data-ui={"ProsValueList[ValueList]"}
			textLabel={translator.text("Listing - Pros (label)")}
			textEmpty={translator.text("Listing - Pros not filled")}
			items={prosItems}
			renderFn={(item) => <Tx label={item.pro} />}
			{...props}
		/>
	);
};
