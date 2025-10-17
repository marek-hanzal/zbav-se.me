import { Icon, SpinnerIcon } from "@use-pico/client";
import type { FC } from "react";
import { Sheet } from "~/app/sheet/Sheet";

export namespace SpinnerSheet {
	export interface Props extends Sheet.Props {}
}

export const SpinnerSheet: FC<SpinnerSheet.Props> = (props) => {
	return (
		<Sheet {...props}>
			<Icon
				icon={SpinnerIcon}
				theme={"dark"}
				tone={"secondary"}
				size={"2xl"}
			/>
		</Sheet>
	);
};
