import { LabelValue } from "@use-pico/client/ui/container";
import { toTimeDiff } from "@use-pico/common/time";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";

export namespace SellerInfoHeader {
	export interface Props {
		locale: string;
		registered: string;
		listings: number;
	}
}

export const SellerInfoHeader: FC<SellerInfoHeader.Props> = ({ locale, registered, listings }) => {
	return (
		<>
			<LabelValue
				textLabel={translator.text("User registered (label)")}
				textValue={toTimeDiff({
					locale,
					time: registered,
					type: "relative",
				})}
			/>

			<LabelValue
				textLabel={translator.text("Seller - listings (label)")}
				textValue={toLocaleNumber({
					locale,
					number: listings,
				})}
			/>
		</>
	);
};
