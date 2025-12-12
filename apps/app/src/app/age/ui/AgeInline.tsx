import { translator } from "@use-pico/common/translator";
import type { FC } from "react";

export namespace AgeInline {
	export interface Props {
		age: number;
	}
}

export const AgeInline: FC<AgeInline.Props> = ({ age }) => {
	return translator.text(`Condition - Age [${age}] (hint)`);
};
