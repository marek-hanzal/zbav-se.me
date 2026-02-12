import { ValueList } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";

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
