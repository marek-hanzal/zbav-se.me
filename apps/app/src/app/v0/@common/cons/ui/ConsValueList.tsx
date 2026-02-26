import { ValueList } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";

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

export const ConsValueList: FC<ConsValueList.Props> = ({ cons, ...props }) => {
	const consItems = cons.map((con, index) => ({
		id: String(index),
		con,
	}));

	return (
		<ValueList
			data-ui={"ConsValueList[ValueList]"}
			textLabel={translator.text("Listing - Cons (label)")}
			textEmpty={translator.text("Listing - Cons not filled")}
			items={consItems}
			renderFn={(item) => <Tx label={item.con} />}
			{...props}
		/>
	);
};
