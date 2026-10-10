import type { FC } from "react";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { ValueList } from "~/ui/ui/ValueList";

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
 */
export const ProsValueList: FC<ProsValueList.Props> = ({ pros, ...props }) => {
	const translator = useTranslator();
	const prosItems = pros.map((pro, index) => ({
		id: String(index),
		pro,
	}));

	return (
		<ValueList
			data-ui={"ProsValueList"}
			textLabel={translator.text("Listing - Pros (label)")}
			textEmpty={translator.text("Listing - Pros not filled")}
			items={prosItems}
			renderFn={(item) => <Tx label={item.pro} />}
			{...props}
		/>
	);
};
