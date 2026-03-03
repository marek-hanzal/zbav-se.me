import { useLocale } from "@use-pico/client/hook";
import { LabelValue } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import { toTimeDiff } from "@use-pico/common/time";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import { translator } from "@use-pico/common/translator";
import type { tSellerInfo } from "@zbav-se.me/sdk/api/buyer";
import type { FC } from "react";

export namespace Header {
	export interface Props {
		sellerInfo: tSellerInfo;
	}
}

export const Header: FC<Header.Props> = ({ sellerInfo }) => {
	const locale = useLocale();

	return (
		<Group>
			<LabelValue
				textLabel={translator.text("User registered (label)")}
				textValue={toTimeDiff({
					locale,
					time: sellerInfo.registered,
					type: "relative",
				})}
			/>

			<LabelValue
				textLabel={translator.text("Seller - listings (label)")}
				textValue={toLocaleNumber({
					locale,
					number: sellerInfo.listings,
				})}
			/>
		</Group>
	);
};
