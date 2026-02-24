import { Icon, ShowIcon } from "@use-pico/client/icon";
import { LabelValue } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";

export namespace ListingSellerInfoPending {
	export interface Props extends LabelValue.PropsEx {
		onSellerInfo(): void;
	}
}

export const ListingSellerInfoPending: FC<ListingSellerInfoPending.Props> = ({
	onSellerInfo,
	...props
}) => {
	return (
		<LabelValue
			textLabel={translator.text("Listing seller hint (label)")}
			textValue={null}
			action={<Icon icon={ShowIcon} />}
			onClick={onSellerInfo}
			{...props}
		/>
	);
};
