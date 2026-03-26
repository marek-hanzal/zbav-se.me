import { useLocale } from "@use-pico/client/hook";
import { LabelValue } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import { toTimeDiff } from "@use-pico/common/time";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";
import type { SellerInfoSchema } from "~/server/@buyer/listing/schema/SellerInfoSchema";

export namespace Header {
	export interface Props {
		sellerInfo: SellerInfoSchema.Type;
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
