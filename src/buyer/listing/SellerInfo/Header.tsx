import type { FC } from "react";
import { Group } from "@/lib/client/group";
import { useLocale } from "@/lib/client/locale";
import { LabelValue } from "@/lib/client/value";
import { toTimeDiff } from "@/lib/common/time";
import { toLocaleNumber } from "@/lib/common/to-locale-number";
import { translator } from "@/lib/common/translation";
import type { SellerInfoSchema } from "~/buyer/listing/server/schema/SellerInfoSchema";

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
