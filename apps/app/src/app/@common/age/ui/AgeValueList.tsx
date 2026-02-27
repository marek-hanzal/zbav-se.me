import { ValueList } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";

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
			renderFn={(item) => translator.text(`Age ${item} (label)`)}
			wrapperProps={{
				ui:
					ageIn.length > 0
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
