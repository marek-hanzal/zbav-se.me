import { Sheet as CoolSheet } from "@use-pico/client";
import type { FC } from "react";

export namespace Sheet {
	export interface Props extends CoolSheet.Props {}
}

export const Sheet: FC<Sheet.Props> = (props) => {
	return <CoolSheet {...props} />;
};
