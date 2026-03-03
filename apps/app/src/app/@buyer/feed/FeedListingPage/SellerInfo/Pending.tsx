import { Icon, ShowIcon } from "@use-pico/client/icon";
import { LabelValue } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";

export namespace Pending {
	export interface Props extends LabelValue.PropsEx {
		//
	}
}

export const Pending: FC<Pending.Props> = (props) => {
	return (
		<LabelValue
			textLabel={translator.text("Listing seller hint (label)")}
			textValue={null}
			action={<Icon icon={ShowIcon} />}
			{...props}
		/>
	);
};
