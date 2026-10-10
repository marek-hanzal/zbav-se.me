import type { FC } from "react";
import type { SellerInfoSchema } from "~/buyer-listing/schema/SellerInfoSchema";
import { toTimeDiff } from "~/date/fn/toTimeDiff";
import { useLocale } from "~/locale/hook/useLocale";
import { toLocaleNumber } from "~/number/fn/toLocaleNumber";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Group } from "~/ui/ui/Group";
import { LabelValue } from "~/ui/ui/LabelValue";

export namespace Header {
	export interface Props {
		sellerInfo: SellerInfoSchema.Type;
	}
}

export const Header: FC<Header.Props> = ({ sellerInfo }) => {
	const translator = useTranslator();
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
