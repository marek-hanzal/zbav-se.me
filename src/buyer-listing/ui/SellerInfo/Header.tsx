import type { FC } from "react";
import type { SellerInfoSchema } from "~/buyer-listing/schema/SellerInfoSchema";
import { toTimeDiffFn } from "~/date/fn/toTimeDiffFn";
import { useLocale } from "~/locale/hook/useLocale";
import { toLocaleNumberFn } from "~/number/fn/toLocaleNumberFn";
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
				textLabel={translator.textFn("User registered (label)")}
				textValue={toTimeDiffFn({
					locale,
					time: sellerInfo.registered,
					type: "relative",
				})}
			/>

			<LabelValue
				textLabel={translator.textFn("Seller - listings (label)")}
				textValue={toLocaleNumberFn({
					locale,
					number: sellerInfo.listings,
				})}
			/>
		</Group>
	);
};
