import type { FC } from "react";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { ValueList } from "~/ui/ui/ValueList";

export namespace ConsValueList {
	export interface Props
		extends Omit<
			ValueList.Props<{
				id: string;
				con: string;
			}>,
			"items" | "renderFn" | "textLabel" | "textEmpty"
		> {
		cons: string[];
	}
}

/**
 * Renders a read-only list of cons values in a consistent label/value style.
 * Use it in detail or preview views when you need to show multiple cons entries clearly.
 */
export const ConsValueList: FC<ConsValueList.Props> = ({ cons, ...props }) => {
	const translator = useTranslator();
	const consItems = cons.map((con, index) => ({
		id: String(index),
		con,
	}));

	return (
		<ValueList
			data-ui={"ConsValueList"}
			textLabel={translator.text("Listing - Cons (label)")}
			textEmpty={translator.text("Listing - Cons not filled")}
			items={consItems}
			renderFn={(item) => <Tx label={item.con} />}
			wrapperProps={{
				"data-ui-tone": cons.length > 0 ? "neutral" : "secondary",
			}}
			{...props}
		/>
	);
};
